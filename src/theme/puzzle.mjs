// Puzzle home: the whole home page is one sheet of flat-color glass pieces held together by black lead.
// Each section is a piece. Neighboring pieces share corners, so they lock together with no filler.
// Built server-side from the page's own copy (src/pages/index.astro); PUZZLE_JS draws the glass in the browser.

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const firstSentence = (t) => (t || '').trim().split(/(?<=[.!?])\s/)[0];

export function puzzleHome(document, { prompt, icons, name, pitch }) {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const txt = (s, r) => ($(s, r)?.textContent || '').trim();
  const main = $('main');
  const cards = $$('.projects__grid .project');
  const card = (c) => ({ href: c.getAttribute('href'), title: txt('h3', c), point: $('.project__points li', c)?.innerHTML.trim() || '' });
  const [c0, c1, ...rest] = cards.map(card);
  const hcs = $('.hcs'), hcsPs = $$('.hcs__content > p', hcs);
  const hcsLinks = $$('.hcs__links a', hcs).map((a) => a.getAttribute('href'));
  const prog = $('.program'), progLink = $('.section-header__link', prog)?.getAttribute('href') || '#';
  const orgP = $('.program__org p', prog);
  const orgRole = orgP ? orgP.childNodes[0].textContent.trim() : 'Creator and instructor';
  const orgName = txt('.program__org p span', prog);
  const topics = $$('.program__topics li', prog).map((li) => li.textContent.trim());
  const pqs = $$('.pq', prog).map((f) => ({ q: txt('blockquote', f), name: txt('figcaption strong', f), role: txt('figcaption small', f) }));
  const groups = $$('.writing__group').map((g) => ({
    src: txt('.writing__src', g),
    items: $$(':scope > ul > li > a', g).map((a) => ({ href: a.getAttribute('href'), t: txt('span', a) || a.textContent.trim() })),
    more: $('.writing__more', g), dialog: $('dialog', g),
  }));
  const exp = $$('.exp__item').map((it) => ({ co: txt('.exp__company', it), when: txt('.exp__period', it), title: txt('.exp__title', it), desc: txt('.exp__desc', it) }));
  const expLink = $('.experience .section-header__link')?.getAttribute('href') || '/about';
  const edu = $$('.cred-card dl > div').map((d) => ({ dt: txt('dt', d), dd: txt('dd', d) }));
  const recs = $$('.recommendation-card').map((f) => ({ q: firstSentence(txt('blockquote p', f)).replace(/^Jeremy Hoover is/, 'Jeremy is'), name: txt('figcaption strong', f), role: txt('figcaption small', f).replace(' · ', ', ') }));
  const contact = $('.contact'), mail = $('.contact__cta a[href^="mailto:"]', contact)?.getAttribute('href') || '#', li = $('.contact__cta a[href*="linkedin"]', contact)?.getAttribute('href') || '#';
  const contactP = txt('.contact__inner p', contact);
  const recUrl = 'https://www.linkedin.com/in/jeremydhoover/details/recommendations/';
  const ext = 'target="_blank" rel="noopener"';
  const read = (label = 'Read the story') => `<span class="pz-link">${label} ↗</span>`;

  const pieces = [
    `<a class="pc pz-feat" data-c="B" data-alt="R" style="grid-area:F" href="${esc(c0.href)}"><h2 class="pz-serif pz-feat__h">${esc(c0.title)}</h2><p class="pz-sub">${c0.point.replace("engineers use", "engineers at Microsoft use")}</p>${read()}</a>`,
    `<a class="pc" data-c="G" style="grid-area:H" href="${esc(c1.href)}"><h3 class="pz-serif pz-side__h">${esc(c1.title)}</h3><p class="pz-sub">${c1.point.replace("Best Use of AI,", "Best Use of AI at Microsoft,")}</p>${read()}</a>`,
    `<div class="pc pz-note" data-c="Y" data-keep="1" data-alt="C" style="grid-area:N"><h1 class="pz-serif pz-note__h1">${esc(name)}</h1><p class="pz-note__p">${esc(pitch)}</p><p class="pz-note__links"><a class="pz-link" href="#projects">More case studies ↓</a><a class="pz-link" href="/about">About me ↗</a></p></div>`,
    `<div class="pc pz-agent" data-c="R" data-calm="1" style="grid-area:A" role="button" tabindex="0" data-pz-copy="${esc(prompt)}" aria-label="Copy the Jeremy Hoover portfolio skill prompt for your AI agent">
      <div class="pz-agent__row"><div class="z pz-agent__tag" data-z="Y">Give this to<br>your AI agent</div><div class="z pz-agent__icons" data-z="B"><span class="pz-agent__works">Works with</span>${icons}</div></div>
      <div class="pz-agent__row pz-agent__row--cmd"><div class="z pz-agent__cmd" data-z="C"><code class="pz-agent__code"><span class="pz-agent__dollar" aria-hidden="true">$</span> <span class="pz-agent__line">${esc(prompt.replace('https://', ''))}</span></code></div><div class="z pz-agent__copy" data-z="R"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M8 8h11v13H8zM5 3h11v3H8a3 3 0 0 0-3 3v9H5z" fill="currentColor"/></svg><span>COPY</span></div></div>
    </div>`,
    `<div class="pc pz-title" data-c="B" style="grid-area:T" id="projects"><h2 class="pz-serif pz-it pz-h2">More case studies</h2></div>`,
    ...rest.slice(0, 4).map((c, i) => `<a class="pc pz-case" data-c="${'RYGB'[i]}" style="grid-area:m${i + 1}" href="${esc(c.href)}"><h3 class="pz-serif">${esc(c.title)}</h3><p class="pz-sub">${c.point}</p>${read('Read case study')}</a>`),
    `<div class="pc pz-group pz-group--prog" data-c="Y" style="grid-area:P" id="program"><div class="z pz-zone pz-zone--prog" data-z="Y" style="grid-area:P"><div class="pz-head"><h2 class="pz-serif pz-it pz-h2">Teaching</h2><a class="pz-link" href="${esc(progLink)}" ${ext}>Explore the program ↗</a></div>
      <h3 class="pz-serif pz-prog__h">Technical Content Designer Program</h3><p class="pz-small"><b>${esc(orgRole)}</b> · ${esc(orgName)}</p>
      <p class="pz-sub">${esc(txt('.program__summary', prog))}</p><p class="pz-tags">${topics.map((t) => `<span class="pz-tag">${esc(t)}</span>`).join('')}</p></div>
      ${pqs.slice(0, 2).map((q, i) => `<figure class="z pz-zone pz-pq" data-z="${i ? 'B' : 'C'}" style="grid-area:${i ? 'R' : 'Q'}"><p class="pz-stars" aria-label="5 out of 5 stars">★★★★★</p><blockquote class="pz-serif pz-q">${esc(q.q)}</blockquote><figcaption class="pz-small"><b>${esc(q.name)}</b> · ${esc(q.role)}</figcaption></figure>`).join('')}</div>`,
    `<div class="pc" data-c="G" style="grid-area:W" id="writing"><h2 class="pz-serif pz-it pz-h2">Published articles</h2><div class="pz-cols">${groups.map((g, i) => `<div class="pz-col" data-g="${i}">${g.items.map((a) => `<a class="pz-art" href="${esc(a.href)}" ${ext}>${esc(a.t)} <span aria-hidden="true">↗</span></a>`).join('')}</div>`).join('')}</div></div>`,
    `<div class="pc" data-c="Y" data-keep="1" style="grid-area:X" id="experience"><div class="pz-head"><h2 class="pz-serif pz-it pz-h2">Experience</h2><a class="pz-link" href="${esc(expLink)}">Full background ↗</a></div>
      ${exp.map((e) => `<div class="pz-exp"><p class="pz-exp__top"><b class="pz-serif">${esc(e.co)}</b><b>${esc(e.when)}</b></p><p class="pz-exp__title">${esc(e.title)}</p><p class="pz-exp__desc">${esc(e.desc)}</p></div>`).join('')}</div>`,
    `<div class="pc" data-c="B" data-keep="1" style="grid-area:D" id="education"><h3 class="pz-serif pz-it pz-edu__h">Education &amp; recognition</h3>${edu.map((e) => `<p class="pz-edu__dt">${esc(e.dt)}</p><p class="pz-edu__dd">${esc(e.dd)}</p>`).join('')}</div>`,
    ...recs.slice(0, 2).map((r, i) => `<figure class="pc pz-rec" data-c="${i ? 'R' : 'B'}" style="grid-area:${i ? 'L' : 'K'}"${i ? '' : ' id="recommendations"'}>${i ? '' : '<h2 class="pz-serif pz-it pz-h2">From colleagues</h2>'}<blockquote class="pz-serif pz-rec__q">“${esc(r.q)}”</blockquote><figcaption class="pz-small"><b>${esc(r.name)}</b> · ${esc(r.role)}</figcaption><a class="pz-link" href="${recUrl}" ${ext}>Read recommendation ↗</a></figure>`),
    `<div class="pc" data-c="G" style="grid-area:V" id="open-source"><h2 class="pz-serif pz-it pz-fv__h"><img class="pz-fv__logo" src="https://fievel.ai/assets/fievel-logo.png" alt="" width="56" height="56">Fievel</h2><p class="pz-fv__p">${esc(hcsPs[0]?.textContent.trim())}</p><p><a class="pz-btn" href="${esc(hcsLinks[0] || 'https://fievel.ai/')}" ${ext}>Visit fievel.ai ↗</a><a class="pz-btn pz-btn--light" href="${esc(hcsLinks[1] || '#')}" ${ext}>View on GitHub</a></p></div>`,
    `<div class="pc pz-fvfacts" data-c="Y" style="grid-area:S"><dl><div><dt>6 skills</dt><dd>in one plugin</dd></div><div><dt>7-stage workflow</dt><dd>and a local CLI that checks it</dd></div><div><dt>MCP server</dt><dd>Local in Claude Code, hosted in Codex</dd></div><div><dt>Works in</dt><dd>Claude Code, Codex, and GitHub Copilot</dd></div></dl></div>`,
    `<div class="pc" data-c="R" style="grid-area:Z" id="contact"><h2 class="pz-serif pz-it pz-cta__h">Let’s build something useful.</h2><p class="pz-sub">${esc(contactP)}</p><p><a class="pz-btn pz-btn--y" href="${esc(mail)}">Email me</a><a class="pz-btn pz-btn--light" href="${esc(li)}" ${ext}>Connect on LinkedIn</a></p></div>`,
  ];

  const pz = document.createElement('div');
  pz.className = 'pz'; pz.dataset.seed = '7';
  pz.innerHTML = pieces.join('\n');
  // blocks that belong together become one piece: each block turns into a zone (one pane) of a shared piece
  [['K', 'L'], ['V', 'S']].forEach((names) => {
    const els = names.map((n) => pz.querySelector(`:scope > .pc[style*="grid-area:${n}"]`)).filter(Boolean);
    if (els.length < 2) return;
    const grp = document.createElement('div');
    grp.className = `pc pz-group pz-group--${names[0]}`; grp.dataset.c = els[0].dataset.c; grp.setAttribute('style', `grid-area:${names[0]}`);
    els[0].before(grp);
    els.forEach((e) => { e.classList.remove('pc'); e.classList.add('z', 'pz-zone'); e.dataset.z = e.dataset.c; e.removeAttribute('data-c'); grp.appendChild(e); });
  });
  // keep the "Show all 8 articles" button and its dialog working
  groups.forEach((g, i) => { const col = pz.querySelector(`.pz-col[data-g="${i}"]`); if (g.more && col) { g.more.className = 'pz-btn pz-btn--sm'; col.appendChild(g.more); } if (g.dialog && col) col.appendChild(g.dialog); });
  [...main.children].forEach((k) => { if (k.tagName !== 'SCRIPT') k.remove(); });
  main.prepend(pz);
  const s = document.createElement('script'); s.textContent = PUZZLE_JS; document.body.appendChild(s);
}

// Browser side: measure each piece, move every shared corner once so neighbors stay locked,
// then cut each piece into a few panes of its color family with lines that stay off the words.
export const PUZZLE_JS = `(() => {
const COL = { B: '#2d62c9', R: '#e1412e', Y: '#f4c21b', G: '#78b13b', C: '#f6eedf' };
const FAM = { Y: ['Y', 'G', 'C'], G: ['G', 'Y', 'C'], C: ['C', 'Y', 'G'], B: ['B', 'R'], R: ['R', 'B'] };
const rng = (s) => () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
const area = (P) => Math.abs(P.reduce((s, q, i) => { const n = P[(i + 1) % P.length]; return s + q[0] * n[1] - n[0] * q[1]; }, 0)) / 2;
const cen = (P) => [P.reduce((s, q) => s + q[0], 0) / P.length, P.reduce((s, q) => s + q[1], 0) / P.length];
const pts = (P) => P.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ');
const inside = (P, q) => { let o = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < ((b[0] - a[0]) * (q[1] - a[1])) / (b[1] - a[1]) + a[0]) o = !o; } return o; };
const cut = (P, o, t) => { const d = [Math.cos(t), Math.sin(t)], side = (q) => (q[0] - o[0]) * d[1] - (q[1] - o[1]) * d[0];
  const A = [], B = [], M = []; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], sa = side(a), sb = side(b);
    (sa >= 0 ? A : B).push(a); if ((sa >= 0) !== (sb >= 0)) { const k = sa / (sa - sb), m = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; A.push(m); B.push(m); M.push(m); } }
  return [A, B, M]; };
const poly = (P, c, w) => '<polygon points="' + pts(P) + '" fill="' + COL[c] + '" stroke="#141414" stroke-width="' + w + '" stroke-linejoin="round"/>';
const segHits = (a, b, bx) => { for (let s = 0; s <= 1; s += 0.005) { const x = a[0] + (b[0] - a[0]) * s, y = a[1] + (b[1] - a[1]) * s; if (x > bx[0] && x < bx[2] && y > bx[1] && y < bx[3]) return true; } return false; };
function draw(comp) {
  comp.querySelector(':scope > svg')?.remove();
  const r = rng(+comp.dataset.seed || 1), cr = comp.getBoundingClientRect();
  const W = Math.round(cr.width), H = Math.round(cr.height), k = Math.min(1, W / 1280), narrow = W < 760;
  const jx = narrow ? 36 : 130 * k, jy = narrow ? 44 : 100;
  const pcs = [...comp.querySelectorAll(':scope > .pc')].map((el) => { const b = el.getBoundingClientRect(); return { el, x0: Math.round(b.left - cr.left), y0: Math.round(b.top - cr.top), x1: Math.round(b.right - cr.left), y1: Math.round(b.bottom - cr.top) }; });
  const moved = new Map(), corners = [];
  pcs.forEach((p) => corners.push([p.x0, p.y0], [p.x1, p.y0], [p.x1, p.y1], [p.x0, p.y1]));
  // a calm piece (the agent piece) keeps its corners near level, so its panes hug the content with no empty glass
  const calm = new Set(); pcs.filter((p) => p.el.dataset.calm).forEach((p) => corners.forEach(([x, y]) => { if ((y === p.y0 || y === p.y1) && x >= p.x0 && x <= p.x1) calm.add(x + ',' + y); }));
  corners.forEach(([x, y]) => { const key = x + ',' + y; if (moved.has(key)) return; const ex = x <= 0 || x >= W, ey = y <= 0 || y >= H, cy = calm.has(key) ? 0.2 : 1;
    moved.set(key, [x + (r() - 0.5) * (ex ? (narrow ? 12 : 50) : jx), y + (r() - 0.5) * (ey ? 40 : jy) * cy]); });
  const outline = (p) => { const c = [[p.x0, p.y0], [p.x1, p.y0], [p.x1, p.y1], [p.x0, p.y1]], out = [];
    for (let i = 0; i < 4; i++) { const a = c[i], b = c[(i + 1) % 4]; out.push(a);
      const on = corners.filter(([x, y]) => (a[1] === b[1] ? y === a[1] && x > Math.min(a[0], b[0]) && x < Math.max(a[0], b[0]) : x === a[0] && y > Math.min(a[1], b[1]) && y < Math.max(a[1], b[1])));
      const uniq = [...new Map(on.map((q) => [q.join(','), q])).values()].sort((u, v) => (a[1] === b[1] ? (u[0] - v[0]) * Math.sign(b[0] - a[0]) : (u[1] - v[1]) * Math.sign(b[1] - a[1])));
      out.push(...uniq); }
    return out.map((q) => moved.get(q.join(','))); };
  // every piece is one unit: thin lead between its own panes, the full lead only around its outside,
  // and a hidden shadow that shows when the piece is hovered
  const unit = (p, idx, P, inner) => { p.el.dataset.g = 'pzu' + idx;
    const ox = (p.x0 + p.x1) / 2, oy = (p.y0 + p.y1) / 2;
    return '<g id="pzu' + idx + '" class="pz-unit" style="transform-origin:' + ox + 'px ' + oy + 'px"><polygon class="lift" points="' + pts(P) + '" fill="#141414" transform="translate(9,9)"/>' + inner
      + '<polygon points="' + pts(P) + '" fill="none" stroke="#141414" stroke-width="7" stroke-linejoin="round"/></g>'; };
  // a pane filled with a photo instead of a color
  const imgPane = (q, src, idx) => { const xs = q.map((v) => v[0]), ys = q.map((v) => v[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0, id = 'pzimg' + idx;
    return '<clipPath id="' + id + '"><polygon points="' + pts(q) + '"/></clipPath><image href="' + src + '" x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMin slice" clip-path="url(#' + id + ')"/>'
      + '<polygon points="' + pts(q) + '" fill="none" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>'; };
  // text boxes of an element, padded, so no lead line ever crosses a word
  const textBoxes = (el) => { const boxes = []; const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let tn;
    while ((tn = tw.nextNode())) { if (!tn.textContent.trim() || tn.parentElement.closest('dialog')) continue; const rg = document.createRange(); rg.selectNodeContents(tn); const clip = tn.parentElement.closest('.pz-agent__line'), cb = clip && clip.getBoundingClientRect(); for (let q of rg.getClientRects()) { if (cb) q = { left: Math.max(q.left, cb.left), right: Math.min(q.right, cb.right), top: q.top, bottom: q.bottom }; if (q.right <= q.left) continue; boxes.push([q.left - cr.left - 12, q.top - cr.top - 10, q.right - cr.left + 12, q.bottom - cr.top + 10]); } }
    el.querySelectorAll('.pz-btn,.pz-tag,svg,img').forEach((e) => { const q = e.getBoundingClientRect(); if (q.width) boxes.push([q.left - cr.left - 12, q.top - cr.top - 12, q.right - cr.left + 16, q.bottom - cr.top + 16]); });
    return boxes; };
  // cut a piece into its main pane plus up to n more. Returns panes; only the main one has a color yet.
  // keep: all the words stay in one pane, so the other pane is an empty corner of glass
  const perim = (P) => P.reduce((s, q, i) => { const n = P[(i + 1) % P.length]; return s + Math.hypot(n[0] - q[0], n[1] - q[1]); }, 0);
  const panes = (P, c, n, boxes, keep, alt) => { const parts = [P];
    for (let m = 0; m < n; m++) {
      parts.sort((u, v) => area(v) - area(u));
      for (let tries = 0; tries < 800; tries++) {
        const big = parts[0], ce = cen(big), steep = r() < 0.5, t = steep ? Math.PI / 2 + (r() - 0.5) * 1.0 : (r() - 0.5) * 0.6;
        const o = [ce[0] + (r() - 0.5) * 800 * k, ce[1] + (r() - 0.5) * 400];
        const [A, B, seg] = cut(big, o, t);
        if (A.length < 3 || B.length < 3 || seg.length !== 2) continue;
        const small = Math.min(area(A), area(B)) === area(A) ? A : B;
        // no thin slivers: the smaller pane must be a real shape, not a strip
        if (area(small) < area(big) * 0.14 || (2 * area(small)) / perim(small) < 46) continue;
        if (boxes.some((bx) => segHits(seg[0], seg[1], bx))) continue;
        if (keep) { const ctr = boxes.map((bx) => [(bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2]); if (!ctr.every((q) => inside(A, q)) && !ctr.every((q) => inside(B, q))) continue; }
        parts.shift(); parts.push(A, B); break;
      }
    }
    const ctr = boxes.map((bx) => [(bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2]);
    const nT = (q) => ctr.filter((t) => inside(q, t)).length;
    parts.sort((u, v) => nT(v) - nT(u) || area(v) - area(u)); // the main color goes to the pane with the words
    return parts.map((q, i) => ({ q, c: i === 0 ? c : null, alt, fam: nT(q) ? FAM[c] : ['B', 'R', 'Y', 'G'] })); };
  // split a piece between its zones (blocks that belong together), cutting along the gaps between them
  const zoneSplit = (part, zz, boxes) => {
    if (zz.length <= 1) return [[part, zz[0]]];
    for (const ax of ['y', 'x']) {
      const s = [...zz].sort((u, v) => u[ax + '0'] - v[ax + '0']);
      for (let i = 1; i < s.length; i++) {
        const m = Math.max(...s.slice(0, i).map((z) => z[ax + '1'])), n = Math.min(...s.slice(i).map((z) => z[ax + '0']));
        if (m > n + 1) continue;
        const A = s.slice(0, i), B = s.slice(i), mid = (m + n) / 2;
        const zb = [Math.min(...zz.map((z) => z.x0)), Math.min(...zz.map((z) => z.y0)), Math.max(...zz.map((z) => z.x1)), Math.max(...zz.map((z) => z.y1))];
        const pt = ax === 'x' ? [mid, (zb[1] + zb[3]) / 2] : [(zb[0] + zb[2]) / 2, mid];
        const has = (Q, Z) => Z.every((z) => inside(Q, [(z.x0 + z.x1) / 2, (z.y0 + z.y1) / 2]));
        for (let tries = 0; tries < 60; tries++) {
          const tilt = (r() - 0.5) * (ax === 'x' ? 0.5 : 0.08) * (1 - tries / 60), t = ax === 'x' ? Math.PI / 2 + tilt : tilt;
          const [P1, P2, seg] = cut(part, pt, t);
          if (P1.length < 3 || P2.length < 3 || seg.length !== 2 || boxes.some((bx) => segHits(seg[0], seg[1], bx))) continue;
          const [QA, QB] = has(P1, A) ? [P1, P2] : [P2, P1];
          if (!has(QA, A) || !has(QB, B)) continue;
          return [...zoneSplit(QA, A, boxes), ...zoneSplit(QB, B, boxes)];
        }
      }
    }
    return [[part, zz[0]]];
  };
  // 1) cut every piece into panes
  const all = [], outlines = [];
  pcs.forEach((p, idx) => {
    const P = outline(p); p.el.dataset.poly = JSON.stringify(P); outlines.push(P);
    const boxes = textBoxes(p.el);
    const zs = [...p.el.querySelectorAll('.z')].map((e) => { const q = e.getBoundingClientRect(); return { el: e, c: e.dataset.z, x0: q.left - cr.left, y0: q.top - cr.top, x1: q.right - cr.left, y1: q.bottom - cr.top }; });
    if (zs.length) zoneSplit(P, zs, boxes).forEach(([q, z]) => all.push({ idx, q, c: z ? z.c : p.el.dataset.c, img: z && z.el.dataset.img }));
    else panes(P, p.el.dataset.c, p.el.dataset.panes != null ? +p.el.dataset.panes : 1, boxes, !!p.el.dataset.keep, p.el.dataset.alt).forEach((o) => all.push({ idx, ...o }));
  });
  // 2) color the free panes so no two touching panes share a color, and the colors stay evenly spread
  const near = (a, b) => { let hits = 0;
    for (let i = 0; i < a.length; i++) { const u = a[i], v = a[(i + 1) % a.length], L = Math.hypot(v[0] - u[0], v[1] - u[1]);
      for (let t = 0; t <= L; t += 10) { const x = u[0] + ((v[0] - u[0]) * t) / L, y = u[1] + ((v[1] - u[1]) * t) / L;
        for (let j = 0; j < b.length; j++) { const p1 = b[j], p2 = b[(j + 1) % b.length], dx = p2[0] - p1[0], dy = p2[1] - p1[1], l2 = dx * dx + dy * dy || 1;
          const s2 = Math.max(0, Math.min(1, ((x - p1[0]) * dx + (y - p1[1]) * dy) / l2)); if (Math.hypot(x - p1[0] - s2 * dx, y - p1[1] - s2 * dy) < 9) { hits++; break; } } } }
    return hits >= 4; };
  const used = { B: 0, R: 0, Y: 0, G: 0, C: 0 }; all.forEach((o) => { if (o.c && used[o.c] != null) used[o.c] += area(o.q); });
  all.filter((o) => !o.c).sort((u, v) => cen(u.q)[1] - cen(v.q)[1]).forEach((o) => {
    const taken = new Set(all.filter((x) => x !== o && x.c && near(o.q, x.q)).map((x) => x.c));
    const ok = o.fam.filter((c) => !taken.has(c));
    const pick = o.alt && !taken.has(o.alt) ? o.alt : (ok.length ? ok : ['C']).slice().sort((u, v) => used[u] - used[v])[0];
    o.c = pick; used[pick] += area(o.q);
  });
  // 3) draw
  let svg = '';
  pcs.forEach((p, idx) => { let g = '';
    all.filter((o) => o.idx === idx).forEach((o) => { g += o.img ? imgPane(o.q, o.img, idx) : poly(o.q, o.c, 3); });
    svg += unit(p, idx, outlines[idx], g); });
  comp.insertAdjacentHTML('afterbegin', '<svg class="pz-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" focusable="false">' + svg + '</svg>');
}
const comps = [...document.querySelectorAll('.pz')];
let lastW = 0;
const run = () => { const w = window.innerWidth; if (w === lastW) return; lastW = w; comps.forEach(draw); };
(document.fonts ? document.fonts.ready : Promise.resolve()).then(run);
let tm; window.addEventListener('resize', () => { clearTimeout(tm); tm = setTimeout(run, 150); });
// hover (or keyboard focus): the whole piece, glass and words together, lights up and grows a little.
// Both scale around the piece's own center, so the glass and the text stay lined up; neighbors don't move.
const hover = matchMedia('(hover: hover)').matches;
document.querySelectorAll('.pz > .pc').forEach((u) => {
  const g = () => document.getElementById(u.dataset.g);
  const on = (v) => { const e = g(); if (!e) return; if (v) e.parentNode.appendChild(e); e.classList.toggle('on', v); u.classList.toggle('on', v); };
  if (hover) { u.addEventListener('mouseenter', () => on(true)); u.addEventListener('mouseleave', () => on(false)); }
  u.addEventListener('focusin', () => on(true)); u.addEventListener('focusout', () => on(false));
});
// the agent piece: a click anywhere on it copies the command
document.querySelectorAll('.pz-agent').forEach((u) => {
  const g = () => document.getElementById(u.dataset.g);
  const copy = async () => { const label = u.querySelector('.pz-agent__copy span');
    try { await navigator.clipboard.writeText(u.dataset.pzCopy); } catch { return; }
    const e = g(); e && e.classList.add('done'); label.textContent = 'COPIED';
    setTimeout(() => { e && e.classList.remove('done'); label.textContent = 'COPY'; }, 1600); };
  u.addEventListener('click', copy); u.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); copy(); } });
});
})();`;
