// Builds llms.txt: a plain-text summary of the portfolio that someone can hand to an AI agent.
// Reads the built pages in dist/, so run it after `astro build` (npm run build does this).
// Writes dist/llms.txt for the deployed site and public/llms.txt so `npm run dev` serves it too.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { parseHTML } from 'linkedom';

const SITE = 'https://jeremyhoover.ai';
const CASES = ['ai-design-repo', 'hackathon', 'org-ai-initiatives', 'fabric-cli', 'statecraft-israel', 'wix-accessibility'];
const load = (p) => parseHTML(readFileSync(new URL(`../dist/${p}`, import.meta.url), 'utf8')).document;
const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const all = (doc, sel) => [...doc.querySelectorAll(sel)];

const out = [];
const home = load('index.html');
out.push('# Jeremy Hoover', '');
out.push(`> ${txt(home.querySelector('.cb-note__txt')) || txt(home.querySelector('h1'))}`, '');
out.push('Senior Content Designer at Microsoft working on AI systems and developer experience. This file summarizes his portfolio for AI agents and recruiters. Every case study links to the full page.', '');

out.push('## Case studies', '');
for (const slug of CASES) {
  const path = `work/${slug}/index.html`;
  if (!existsSync(new URL(`../dist/${path}`, import.meta.url))) continue;
  const d = load(path);
  out.push(`### ${txt(d.querySelector('h1'))}`, '');
  out.push(`URL: ${SITE}/work/${slug}/`, '');
  const lede = txt(d.querySelector('.cb-lede')) || txt(d.querySelector('.lede'));
  if (lede) out.push(lede, '');
  const glance = all(d, '.glance > div').map((g) => `- ${txt(g.querySelector('dt'))}: ${txt(g.querySelector('dd'))}`);
  if (glance.length) out.push(...glance, '');
  const outcomes = all(d, '.outcome').map((o) => `- ${txt(o.querySelector('.outcome__num'))}: ${txt(o.querySelector('.outcome__label'))}`);
  if (outcomes.length) out.push('Outcomes:', ...outcomes, '');
}

const about = load('about/index.html');
out.push('## About', '');
const aboutText = [about.querySelector('.cb-intro__lede'), ...all(about, '.cb-intro__cols p')].map(txt).filter(Boolean);
out.push(...aboutText.flatMap((p) => [p, '']));
out.push(`Full page: ${SITE}/about/`, '');

out.push('## Experience', '');
for (const item of all(about, '.experience__item').filter((i) => !i.closest('.cb-edu-card'))) {
  const org = txt(item.querySelector('.experience__meta strong'));
  const when = txt(item.querySelector('.experience__meta span'));
  const role = txt(item.querySelector('.experience__role'));
  const desc = all(item, ':scope > p:not(.experience__role)').map(txt).join(' ');
  out.push(`- **${org}**${when ? ` (${when})` : ''}${role ? `: ${role}.` : ''} ${desc}`.trim());
}
out.push('');

const recog = all(home, '.cred-card dl > div').map((g) => `- ${txt(g.querySelector('dt'))}, ${txt(g.querySelector('dd'))}`);
if (recog.length) out.push('## Education and recognition', '', ...recog, '');

const seen = new Set();
const linkTitle = (a) => { const own = [...a.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim(); return own || txt(a.querySelector('span, strong')) || txt(a); };
const articles = all(home, '.writing a[href^="http"]').filter((a) => !seen.has(a.getAttribute('href')) && seen.add(a.getAttribute('href'))).map((a) => `- [${linkTitle(a)}](${a.getAttribute('href')})`).filter((l) => !l.startsWith('- [Show'));
if (articles.length) out.push('## Published articles', '', ...articles, '');

out.push('## Contact', '', '- Email: jeremyd.hoover@gmail.com', '- LinkedIn: https://www.linkedin.com/in/jeremydhoover/', '- GitHub: https://github.com/jeremydhoover-blip', `- Portfolio: ${SITE}/`, '');

const body = out.join('\n').replace(/\n{3,}/g, '\n\n');
writeFileSync(new URL('../dist/llms.txt', import.meta.url), body);
writeFileSync(new URL('../public/llms.txt', import.meta.url), body);
console.log(`llms.txt: ${body.length} characters`);
