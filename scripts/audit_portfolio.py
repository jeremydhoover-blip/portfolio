#!/usr/bin/env python3
"""Deterministic quality audit for the built Jeremy Hoover portfolio."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


ROOT = Path(__file__).resolve().parents[1]


@dataclass
class Link:
    href: str
    target: str
    rel: set[str]
    text_parts: list[str] = field(default_factory=list)

    @property
    def text(self) -> str:
        return " ".join(" ".join(self.text_parts).split())


class DocumentParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.lang = ""
        self.title_parts: list[str] = []
        self.meta_description = ""
        self.headings: list[tuple[int, str]] = []
        self.images_without_alt: list[str] = []
        self.ids: list[str] = []
        self.links: list[Link] = []
        self.visible_text: list[str] = []
        self._heading_level: int | None = None
        self._heading_parts: list[str] = []
        self._current_link: Link | None = None
        self._in_title = False
        self._ignored_depth = 0

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = {key: value or "" for key, value in attrs_list}
        if tag == "html":
            self.lang = attrs.get("lang", "")
        if tag in {"style", "script", "svg"}:
            self._ignored_depth += 1
        if tag == "title":
            self._in_title = True
        if tag == "meta" and attrs.get("name", "").lower() == "description":
            self.meta_description = attrs.get("content", "").strip()
        if re.fullmatch(r"h[1-6]", tag):
            self._heading_level = int(tag[1])
            self._heading_parts = []
        if tag == "img" and "alt" not in attrs:
            self.images_without_alt.append(attrs.get("src", "<missing src>"))
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "a":
            rel = {item.lower() for item in attrs.get("rel", "").split()}
            self._current_link = Link(attrs.get("href", ""), attrs.get("target", ""), rel)
            self.links.append(self._current_link)

    def handle_endtag(self, tag: str) -> None:
        if tag in {"style", "script", "svg"} and self._ignored_depth:
            self._ignored_depth -= 1
        if tag == "title":
            self._in_title = False
        if self._heading_level is not None and tag == f"h{self._heading_level}":
            text = " ".join(" ".join(self._heading_parts).split())
            self.headings.append((self._heading_level, text))
            self._heading_level = None
            self._heading_parts = []
        if tag == "a":
            self._current_link = None

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)
        if self._heading_level is not None:
            self._heading_parts.append(data)
        if self._current_link is not None:
            self._current_link.text_parts.append(data)
        if not self._ignored_depth and data.strip():
            self.visible_text.append(data)

    @property
    def title(self) -> str:
        return " ".join(" ".join(self.title_parts).split())

    @property
    def text(self) -> str:
        return " ".join(" ".join(self.visible_text).split())


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=ROOT / "quality" / "portfolio-standards.json")
    parser.add_argument("--dist", type=Path, default=ROOT / "dist")
    parser.add_argument("--json-report", type=Path)
    return parser.parse_args()


def add_issue(issues: list[dict[str, str]], severity: str, check: str, location: str, message: str) -> None:
    issues.append({"severity": severity, "check": check, "location": location, "message": message})


def route_url(route: str, base_path: str) -> str:
    if route == "index.html":
        return f"{base_path}/"
    return f"{base_path}/{route.removesuffix('/index.html')}"


def href_to_file(href: str, current_url: str, base_path: str, dist: Path) -> tuple[Path | None, str]:
    parsed = urlsplit(urljoin(f"https://portfolio.local{current_url}", href))
    if parsed.netloc != "portfolio.local":
        return None, parsed.fragment
    path = unquote(parsed.path)
    if path == base_path:
        path = f"{base_path}/"
    if not path.startswith(f"{base_path}/"):
        return None, parsed.fragment
    relative = path[len(base_path):].lstrip("/")
    if not relative:
        return dist / "index.html", parsed.fragment
    candidate = dist / relative
    if candidate.suffix:
        return candidate, parsed.fragment
    return candidate / "index.html", parsed.fragment


def audit_document(
    route: str,
    parser: DocumentParser,
    config: dict,
    documents: dict[str, DocumentParser],
    dist: Path,
    issues: list[dict[str, str]],
) -> None:
    accessibility = config["accessibility"]
    base_path = config["site"]["basePath"]
    current_url = route_url(route, base_path)

    if parser.lang.lower() != accessibility["documentLanguage"].lower():
        add_issue(issues, "error", "document-language", route, f"Expected lang={accessibility['documentLanguage']!r}, found {parser.lang!r}.")
    if not parser.title:
        add_issue(issues, "error", "page-title", route, "Missing document title.")
    if accessibility["requireMetaDescription"] and not parser.meta_description:
        add_issue(issues, "error", "meta-description", route, "Missing meta description.")

    h1_count = sum(level == 1 for level, _ in parser.headings)
    if h1_count != accessibility["h1PerPage"]:
        add_issue(issues, "error", "h1-count", route, f"Expected {accessibility['h1PerPage']} H1, found {h1_count}.")

    if accessibility["disallowHeadingSkips"]:
        for previous, current in zip(parser.headings, parser.headings[1:]):
            if current[0] > previous[0] + 1:
                add_issue(issues, "error", "heading-order", route, f"Heading level skips from H{previous[0]} to H{current[0]} near {current[1]!r}.")

    duplicate_ids = sorted({value for value in parser.ids if parser.ids.count(value) > 1})
    for duplicate in duplicate_ids:
        add_issue(issues, "error", "duplicate-id", route, f"Duplicate id {duplicate!r}.")

    skip_target = accessibility["requireSkipLinkTarget"]
    if skip_target not in parser.ids:
        add_issue(issues, "error", "skip-link", route, f"Missing skip-link target id {skip_target!r}.")
    if not any(link.href == f"#{skip_target}" for link in parser.links):
        add_issue(issues, "error", "skip-link", route, f"Missing link to skip target #{skip_target}.")

    if accessibility["requireImageAlt"]:
        for src in parser.images_without_alt:
            add_issue(issues, "error", "image-alt", route, f"Image is missing an alt attribute: {src}.")

    for character in config["content"]["forbiddenCharacters"]:
        if character in parser.text:
            add_issue(issues, "error", "forbidden-character", route, f"Visible copy contains forbidden character {character!r}.")

    if route == "index.html":
        homepage_text = parser.text.casefold()
        for term in config["content"]["requiredPositioningTerms"]:
            if term.casefold() not in homepage_text:
                add_issue(issues, "error", "homepage-positioning", route, f"Homepage is missing required positioning term {term!r}.")

    for domain in config["site"]["forbiddenDomains"]:
        if domain.lower() in parser.text.lower():
            add_issue(issues, "error", "forbidden-domain", route, f"Visible content references forbidden domain {domain!r}.")

    for link in parser.links:
        href = link.href.strip()
        if not href:
            add_issue(issues, "error", "empty-link", route, "Link has an empty href.")
            continue
        if link.target == "_blank" and accessibility["requireNoopenerForBlankTargets"] and "noopener" not in link.rel:
            add_issue(issues, "error", "noopener", route, f"External link {href!r} opens a new tab without rel=noopener.")
        for domain in config["site"]["forbiddenDomains"]:
            if domain.lower() in href.lower():
                add_issue(issues, "error", "forbidden-domain", route, f"Link references forbidden domain {domain!r}: {href}.")
        if href.startswith(("mailto:", "tel:", "javascript:")):
            continue
        parsed_href = urlsplit(href)
        if parsed_href.scheme in {"http", "https"}:
            continue
        target_file, fragment = href_to_file(href, current_url, base_path, dist)
        if target_file is None:
            add_issue(issues, "error", "base-path", route, f"Internal link escapes the {base_path!r} base path: {href}.")
            continue
        if not target_file.exists():
            add_issue(issues, "error", "internal-link", route, f"Internal link target does not exist: {href}.")
            continue
        if fragment:
            target_route = target_file.relative_to(dist).as_posix()
            target_document = documents.get(target_route)
            if target_document and fragment not in target_document.ids:
                add_issue(issues, "error", "anchor-target", route, f"Anchor target #{fragment} does not exist for {href}.")


def audit_source(config: dict, issues: list[dict[str, str]]) -> None:
    css_path = ROOT / "src" / "styles" / "global.css"
    layout_path = ROOT / "src" / "layouts" / "Base.astro"
    astro_config_path = ROOT / "astro.config.mjs"
    css = css_path.read_text(encoding="utf-8")
    layout = layout_path.read_text(encoding="utf-8")
    astro_config = astro_config_path.read_text(encoding="utf-8")

    for token, expected in config["brand"]["colors"].items():
        match = re.search(rf"{re.escape(token)}\s*:\s*(#[0-9a-fA-F]{{6}})", css)
        if not match:
            add_issue(issues, "error", "brand-token", css_path.relative_to(ROOT).as_posix(), f"Missing color token {token}.")
        elif match.group(1).lower() != expected.lower():
            add_issue(issues, "error", "brand-token", css_path.relative_to(ROOT).as_posix(), f"{token} is {match.group(1)}, expected {expected}.")

    for font in config["brand"]["fonts"]:
        if font not in css or font.replace(" ", "+") not in layout:
            add_issue(issues, "error", "brand-font", "src", f"Font {font!r} is not declared in CSS and loaded by the base layout.")

    base_path = config["site"]["basePath"]
    if not re.search(rf"base\s*:\s*['\"]{re.escape(base_path)}['\"]", astro_config):
        add_issue(issues, "error", "astro-base", astro_config_path.relative_to(ROOT).as_posix(), f"Astro base must remain {base_path!r}.")

    canonical_origin = config["site"]["canonicalOrigin"].rstrip("/")
    if not re.search(rf"site\s*:\s*['\"]{re.escape(canonical_origin)}['\"]", astro_config):
        add_issue(issues, "error", "astro-site", astro_config_path.relative_to(ROOT).as_posix(), f"Astro site must remain {canonical_origin!r}.")


def main() -> int:
    args = parse_args()
    config = json.loads(args.config.read_text(encoding="utf-8"))
    issues: list[dict[str, str]] = []
    documents: dict[str, DocumentParser] = {}

    for route in config["site"]["requiredRoutes"]:
        path = args.dist / route
        if not path.exists():
            add_issue(issues, "error", "required-route", route, "Required built route is missing. Run npm run build first.")
            continue
        parser = DocumentParser()
        parser.feed(path.read_text(encoding="utf-8"))
        documents[route] = parser

    for route, parser in documents.items():
        audit_document(route, parser, config, documents, args.dist, issues)

    audit_source(config, issues)

    report = {
        "ok": not any(issue["severity"] == "error" for issue in issues),
        "pagesChecked": len(documents),
        "issues": issues,
    }

    if args.json_report:
        args.json_report.parent.mkdir(parents=True, exist_ok=True)
        args.json_report.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    if issues:
        for issue in issues:
            print(f"{issue['severity'].upper()}: [{issue['check']}] {issue['location']}: {issue['message']}")
    else:
        print(f"Portfolio audit passed: {len(documents)} pages checked.")

    return 0 if report["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
