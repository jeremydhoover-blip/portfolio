// Color-block theme: restructures each rendered page into the color-block layout.
// Runs server-side from src/middleware.ts (in dev and at build), so the shipped HTML is static.
// Page copy still lives in src/pages; this file only rearranges it and adds art and labels.
import ART from './art.json';

const AGENT_PROMPT = 'Use the skill at https://jeremyhoover.ai/agent/SKILL.md to tell me how Jeremy Hoover fits the role I am hiring for.';

export function colorblock(document, pathname) {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const bg = (e, k) => { e.setAttribute('style', `${e.getAttribute('style') ? e.getAttribute('style') + ';' : ''}background-image:url("${ART[k]}")`); return e; };
const path = pathname.replace(/\/$/, '').replace(/\.html$/, '').replace(/\/index$/, '');
const page = path === '' ? 'home' : path.startsWith('/work/') ? 'case' : path.startsWith('/about') ? 'about' : 'other';
document.body.classList.add('cb', 'cb-' + page);
const logo = $('.nav__logo'); if (logo && !$('.cb-tag')) logo.appendChild(el('span', 'cb-tag', 'Content design / AI systems / Developer experience'));
const firstSentence = t => (t || '').trim().split(/(?<=[.!?])\s/)[0];
// band: full-width colored header with shard strip on the right
const band = (title, color, strip, link) => { const b = el('div', `cb-band cb-band--${color}`, `<h2>${title}</h2>${link ? `<a class="cb-band__link" href="${link[1]}">${link[0]}</a>` : ''}<span class="cb-band__strip"></span>`); bg($('.cb-band__strip', b), strip); return b; };
const panel = (cls, ...kids) => { const p = el('section', 'cbp ' + (cls || '')); kids.forEach(k => k && p.appendChild(k)); return p; };
const inner = (...kids) => { const w = el('div', 'cbp__in'); kids.forEach(k => k && w.appendChild(k)); return w; };

if (page === 'home') {
  const main = $('main'), hero = $('.hero'), cards = $$('.projects__grid .project'), hcs = $('.hcs');
  const c0 = cards[0], c1 = cards[1];
  const pt = c => { const li = $('.project__points li', c); return li ? li.textContent.trim() : ''; };
  const feat = el('section', 'cb-feat', `<p class="cb-label"><em>Featured work</em></p><div class="cb-feat__grid">
    <a class="cb-tile cb-tile--big" href="${c0.getAttribute('href')}"><span class="cb-tile__art"></span><span class="cb-tile__txt cb-tile__txt--blue"><span class="cb-kicker">Microsoft · Shared design repos</span><strong>${$('h3', c0).textContent}</strong><span class="cb-sub">${pt(c0)}</span><span class="cb-link">Read the story ↗</span></span></a>
    <a class="cb-tile cb-tile--side" href="#open-source"><span class="cb-tile__art"></span><span class="cb-tile__txt cb-tile__txt--yellow"><span class="cb-kicker">Open source · Fievel</span><strong>A content system you can build on</strong><span class="cb-sub">${firstSentence($('.hcs__content > p', hcs)?.textContent)}</span><span class="cb-link">Read the story ↗</span></span></a>
    <div class="cb-agent"><span class="cb-kicker">For your AI agent</span><div class="cb-agent__row"><code class="cb-agent__prompt" title="Copies: ${AGENT_PROMPT}"><span aria-hidden="true">$</span> Jeremy Hoover portfolio skill</code><button type="button" class="cb-agent__copy" data-copy="${AGENT_PROMPT}" aria-label="Copy the Jeremy Hoover portfolio skill prompt for your AI agent"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 8h11v13H8zM5 3h11v3H8a3 3 0 0 0-3 3v9H5z" fill="currentColor"/></svg><span>Copy</span></button></div></div>
    <a class="cb-tile cb-tile--side" href="${c1.getAttribute('href')}"><span class="cb-tile__art"></span><span class="cb-tile__txt cb-tile__txt--green"><span class="cb-kicker">Microsoft · Hackathon winner</span><strong>${$('h3', c1).textContent}</strong><span class="cb-sub">${pt(c1)}</span><span class="cb-link">Read the story ↗</span></span></a>
  </div>`);
  const arts = $$('.cb-tile__art', feat); bg(arts[0], 'hero'); bg(arts[1], 'fievel'); bg(arts[2], 'case-hackathon');
  const note = el('section', 'cb-note', `<em>A note from Jeremy</em><span class="cb-note__txt"><h1 class="cb-note__h1">${$('.hero__name', hero).textContent}</h1> ${$('.hero__pitch', hero).textContent}</span><a href="#projects">More case studies ↓</a><a href="/about">About me ↗</a>`);
  hero.replaceWith(feat); feat.after(note);
  c0.remove(); c1.remove();
  // generic: turn each section header into a full-width band
  const mk = (sec, title, color, strip) => { if (!sec) return; const hd = $('.section-header', sec); const lk = hd ? $('.section-header__link', hd) : null; const b = band(title, color, strip, lk ? [lk.textContent.replace('→', '↗').replace('&#8594;', ''), lk.getAttribute('href')] : null); if (hd) { b.id = hd.id; hd.remove(); } sec.classList.add('cbp'); sec.prepend(b); };
  const P = $('.projects'), E = $('.experience'), R = $('.recommendations'), G = $('.program'), W = $('.writing'), C = $('.contact');
  mk(P, 'More case studies', 'blue', 'strip0'); mk(G, 'Teaching', 'black', 'strip1'); mk(W, 'Published articles', 'red', 'strip2'); mk(E, 'Experience', 'blue', 'strip3'); mk(R, 'From colleagues', 'yellow', 'strip4');
  // case rows
  const thumbs = { 'org-ai-initiatives': 'thumb1', 'fabric-cli': 'thumb3', 'statecraft-israel': 'thumb4', 'wix-accessibility': 'thumb-wix' };
  $$('.projects__grid .project').forEach(c => { const slug = c.getAttribute('href').split('/').pop(); $('.project__body', c).prepend(bg(el('span', 'cb-thumb'), thumbs[slug] || 'thumb0')); const lk = $('.project__link', c); if (lk) lk.innerHTML = 'Read case study ↗'; });
  // program: title inside yellow body + laptop art
  if (G) { const about = $('.program__about', G); about.prepend(el('h3', 'cb-prog-title', 'Technical Content Designer Program')); about.appendChild(bg(el('span', 'cb-laptop'), 'laptop')); }
  // writing thumbs
  $$('.writing__group').forEach((g, i) => g.prepend(bg(el('span', 'cb-wthumb'), 'thumb' + [0, 5, 6][i % 3])));
  // education becomes its own green card w/ band look
  const cred = $('.cred-card'); if (cred) { const h = $('h3', cred); if (h) h.textContent = 'Education & recognition'; }
  // colleagues: short pull quotes
  $$('.recommendation-card', R).forEach((f, i) => {
    const ps = $$('blockquote p', f); const q = firstSentence(ps[0].textContent).replace(/^Jeremy Hoover is/, 'Jeremy is');
    const name = $('figcaption strong', f)?.textContent || ''; const role = $('figcaption small', f)?.textContent || ''; const img = $('figcaption img', f)?.getAttribute('src') || '';
    f.innerHTML = `<span class="cb-qmark cb-qmark--${i % 2 ? 'red' : 'blue'}" aria-hidden="true"><svg viewBox="0 0 44 34" width="30" height="23" aria-hidden="true"><path d="M2 2h16v16l-7 14H4l6-14H2zM26 2h16v16l-7 14h-7l6-14h-8z" fill="currentColor"/></svg></span><blockquote>${q}</blockquote><figcaption>${img ? `<img src="${img}" alt="">` : ''}<span><b>${name}</b><small>${role} · LinkedIn recommendation</small></span></figcaption><a class="cb-more" href="https://www.linkedin.com/in/jeremydhoover/details/recommendations/">Read recommendation ↗</a>`;
  });
  // fievel panel
  if (hcs) { hcs.classList.add('cbp', 'cbp--fievel'); const h = $('h2', hcs); const b = band(h.textContent, 'green', 'strip5'); b.id = 'open-source'; h.remove(); $$('[id="open-source"]', hcs).forEach(x => x.removeAttribute('id')); hcs.prepend(b); }
  // reorder: projects, program, writing, experience, recommendations, hcs, contact
  [G, W, E, R, hcs, C].forEach(s => s && main.appendChild(s));
  // contact: colorful split
  if (C) { const h = $('h2', C); h.textContent = 'Let’s build something useful.'; C.classList.add('cbp', 'cbp--contact'); C.prepend(bg(el('span', 'cb-contact-art'), 'contact')); }
}

if (page === 'case') {
  const slug = path.split('/').pop();
  const art_ = $('article.case-study'), hero = $('.case-hero'), hm = $('.case-hero__main', hero), glance = $('.glance-card'), shell = $('.case-shell'), strip = $('.outcomes-strip');
  const h1 = $('h1', hm), lede = $('.lede', hm);
  const dds = {}; $$('.glance > div', glance).forEach(d => dds[$('dt', d).textContent.trim()] = $('dd', d).textContent.trim());
  const company = { 'statecraft-israel': 'Statecraft: Israel', 'wix-accessibility': 'Wix.com' }[slug] || 'Microsoft';
  const short = { 'ai-design-repo': 'AI design repos', 'hackathon': 'Hackathon PM agent', 'org-ai-initiatives': 'Org AI adoption', 'fabric-cli': 'Fabric CLI', 'statecraft-israel': 'Statecraft: Israel', 'wix-accessibility': 'Accessibility checker' }[slug] || h1.textContent;
  const keys = Object.keys(dds).slice(0, 3);
  // HERO
  const heroP = panel('cbp--hero', el('div', 'cb-hero', `<div class="cb-hero__txt"><p class="cb-crumb"><a href="/#projects">Work</a> / ${short}</p><p class="cb-company">${company}</p><h1>${h1.textContent}</h1><p class="cb-lede">${lede.textContent}</p><div class="cb-meta">${keys.map(k => `<div><b>${k}:</b> ${dds[k].split(/[,.;]/)[0]}</div>`).join('')}</div></div><div class="cb-hero__art"></div>`));
  bg($('.cb-hero__art', heroP), 'case-' + slug);
  // gather content
  const kids = [...shell.children];
  const toc = $('.case-toc', shell), disc = $('.disclosure', shell), nextSys = $('.next-system', shell), pag = $('.case-pagination', shell);
  const secs = kids.filter(k => k.classList.contains('content-section'));
  // OVERVIEW: toc | first two sections | glance
  const ov = el('div', 'cb-ov'); const ovMid = el('div', 'cb-ov__mid'); secs.slice(0, 2).forEach(s => ovMid.appendChild(s));
  const rail = el('div', 'cb-ov__rail'); rail.appendChild(glance); if (disc) rail.appendChild(disc);
  if (toc) { $$('a', toc).forEach((a, i) => { if (i === 0) a.classList.add('is-on'); }); ov.appendChild(toc); } ov.appendChild(ovMid); ov.appendChild(rail);
  const ovP = panel('cbp--ov', inner(ov));
  // STORY rows (sections 3..n-1) with figures attached to preceding row
  const last = secs[secs.length - 1];
  const storySecs = secs.slice(2, -1);
  const rows = el('div', 'cb-rows'); let n = 0, cur = null;
  const colors = ['blue', 'red', 'green', 'yellow'];
  const artifacts = [];
  let seenLast = false; const tail = []; const skip = ['case-toc', 'disclosure', 'next-system', 'case-pagination', 'divider'];
  kids.forEach(k => {
    if (k === last) { seenLast = true; return; }
    if (storySecs.includes(k)) {
      const h = $('h2', k); const row = el('div', 'cb-row', `<div class="cb-row__head"><span class="cb-tick cb-tick--${colors[n % 4]}"></span><span class="cb-row__num">${String(n + 1).padStart(2, '0')}</span><h3>${h.textContent}</h3></div><div class="cb-row__body"></div>`);
      h.remove(); const body = $('.cb-row__body', row); [...k.childNodes].forEach(c => body.appendChild(c)); if (k.id) row.id = k.id; rows.appendChild(row); cur = row; n++;
    } else if (!k.classList.contains('content-section') && k.tagName !== 'HR' && !skip.some(c => k.classList.contains(c)) && !secs.includes(k)) {
      if (seenLast) tail.push(k); else if (!cur) artifacts.push(k); else { const f = el('div', 'cb-row__fig'); f.appendChild(k); cur.after(f); }
    }
  });
  const storyP = rows.children.length ? panel('cbp--story', band('How the work happened', 'blue', 'strip0'), inner(rows)) : null;
  const artP = artifacts.length ? panel('cbp--art', band('Project artifact', 'black', 'strip3'), inner(...artifacts)) : null;
  // WHAT SHIPPED
  const shipP = panel('cbp--ship', inner(el('h2', 'cb-big-h', 'What shipped'), strip));
  // LEARNED + evidence
  const lh = $('h2', last); const learned = el('div', 'cb-learn', `<div class="cb-learn__main"><h2 class="cb-big-h">${lh ? lh.textContent : 'What I learned'}</h2></div>`); if (lh) lh.remove(); [...last.childNodes].forEach(c => $('.cb-learn__main', learned).appendChild(c));
  tail.forEach(t => $('.cb-learn__main', learned).appendChild(t));
  if (nextSys) { nextSys.classList.add('cb-learn__side'); learned.appendChild(nextSys); }
  if (last.id) learned.id = last.id;
  const learnP = panel('cbp--learn', inner(learned));
  // NEXT
  const nx = pag ? $('.case-pagination__link--next', pag) : null; const pv = pag ? $$('.case-pagination__link', pag).find(a => !a.classList.contains('case-pagination__link--next')) : null;
  const nextP = nx ? el('section', 'cb-next', `<a class="cb-next__story" href="${nx.getAttribute('href')}"><em>Next<br>story</em><span class="cb-next__bar"><strong>${$('.case-pagination__title', nx).textContent}</strong><span class="cb-next__arrow">→</span></span></a><p class="cb-next__foot"><a href="/#projects">Back to all work</a>${pv ? `<a href="${pv.getAttribute('href')}">${$('.case-pagination__direction', pv).textContent}: ${$('.case-pagination__title', pv).textContent}</a>` : ''}</p>`) : null;
  const wrap = el('div', 'cb-case');
  [heroP, ovP, artP, storyP, shipP, learnP, nextP].forEach(p => p && wrap.appendChild(p));
  art_.replaceWith(wrap);
  // figures: full width, colored frame, numbered bar
  const fc = ['blue', 'yellow', 'red', 'green'];
  $$('.evidence-figure, .system-figure, .gameplay-figure', wrap).forEach((f, i) => { f.classList.add('cb-fig', 'cb-fig--' + fc[i % 4]); f.prepend(el('div', 'cb-fig__bar', `<span>Figure ${String(i + 1).padStart(2, '0')}</span>`)); });
  const T = e => e ? e.textContent.trim() : '';
  const CC = ['blue', 'red', 'yellow', 'green', 'black'];
  // Before / After -> shattered vs assembled
  $$('.workflow-compare, .before-after', wrap).forEach(cmp => {
    const [b, a] = $$('.workflow-panel, .ba-panel', cmp);
    const parts = p => ({ tag: T($('.diagram-label, .ba-label', p)), h: T($('h3', p)), tools: $$('.tool-row span', p).map(T), items: $$('li', p).map(T) });
    const B = parts(b), Aa = parts(a);
    const rot = [-7, 4, -3, 6, -5, 3, -8];
    const frags = [...B.tools.map(t => ['tool', t]), ...B.items.map(t => ['item', t])];
    const out = el('div', 'cbx-ba', `
      <div class="cbx-ba__before"><div class="cbx-ba__head"><span class="cbx-tag cbx-tag--red">${B.tag}</span><h3>${B.h}</h3></div>
        <div class="cbx-ba__scatter">${frags.map(([k, t], i) => `<span class="cbx-frag cbx-frag--${k} cbx-frag--v${i % 3}" style="--r:${rot[i % rot.length]}deg">${t}</span>`).join('')}</div></div>
      <div class="cbx-ba__arrow" aria-hidden="true"><span></span></div>
      <div class="cbx-ba__after"><div class="cbx-ba__head"><span class="cbx-tag cbx-tag--green">${Aa.tag}</span><h3>${Aa.h}</h3></div>
        ${Aa.tools.length ? `<div class="cbx-ba__tools">${Aa.tools.map((t, i) => `<span class="cbx-chipc cbx-c--${CC[i % 4]}">${t}</span>`).join('')}</div>` : ''}
        <div class="cbx-ba__stack">${Aa.items.map((t, i) => `<span class="cbx-slab"><i class="cbx-sq cbx-c--${CC[i % 4]}">✓</i>${t}</span>`).join('')}</div></div>`);
    bg($('.cbx-ba__before', out), 'shatter');
    cmp.replaceWith(out);
  });
  // step flows -> chevron ribbon
  $$('.cb-fig ol, .evolution-grid', wrap).forEach(ol => {
    if (ol.closest('.cbx-ba')) return;
    const items = [...ol.children].map(li => { const sp = [...li.children]; const num = sp.find(c => c.tagName === 'SPAN' && /^\s*\d+\s*$/.test(c.textContent)); const st = $('strong', li); const desc = sp.filter(c => c !== num && c !== st).map(T).join(' '); return { num: T(num), st: T(st), desc }; });
    if (!items.length || !items[0].st) return;
    const out = el('div', 'cbx-chev', items.map((it, i) => `<div class="cbx-chev__seg cbx-c--${CC[i % 5]}${i === 0 ? ' is-first' : ''}${i === items.length - 1 ? ' is-last' : ''}"><div class="cbx-chev__in"><b class="cbx-chev__n">${(it.num || String(i + 1)).padStart(2, '0')}</b><strong>${it.st}</strong><small>${it.desc}</small></div></div>`).join(''));
    out.setAttribute('style', `--n:${items.length}`);
    ol.replaceWith(out);
  });
  // layers -> staircase strata
  $$('.architecture, .system-grid', wrap).forEach(g => {
    const items = [...g.children].map(c => ({ num: T($('span', c)), st: T($('h3, strong', c)), desc: T($('p, small', c)) }));
    const out = el('div', 'cbx-strata', items.map((it, i) => `<div class="cbx-layer cbx-c--${CC[i % 4]}" style="--i:${i}"><b class="cbx-layer__n">${it.num.padStart(2, '0')}</b><strong>${it.st}</strong><small>${it.desc}</small></div>`).join(''));
    g.replaceWith(out);
  });
  // conversation -> transcript rows
  $$('.conversation', wrap).forEach(cv => {
    const rows = [...cv.children].map(m => {
      const who = T($('span', m)); const isRep = m.classList.contains('report-preview');
      if (isRep) return `<div class="cbx-chat__report"><div class="cbx-chat__rephead">${who}</div><strong>${T($('strong', m))}</strong><p>${T($('p', m))}</p></div>`;
      const agent = m.classList.contains('message--agent');
      return `<div class="cbx-chat__row ${agent ? 'is-agent' : 'is-user'}"><span class="cbx-chat__av">${agent ? 'AI' : 'PM'}</span><div class="cbx-chat__msg"><em>${who}</em><p>${T($('p', m))}</p></div></div>`;
    }).join('');
    cv.replaceWith(el('div', 'cbx-chat', rows));
  });
  // card grids -> mosaic
  $$('.impact-grid, .conditions-grid', wrap).forEach(g => g.classList.add('cbx-mosaic', 'cbx-mosaic--' + g.children.length));
  const clp = $('.closing-panel', wrap); if (clp) clp.classList.add('cbx-closing');
  const gp = $('.gameplay-figure', wrap); if (gp) { const im = $('img', gp); const mat = el('div', 'cbx-mat'); bg(mat, 'mat'); im.replaceWith(mat); mat.appendChild(im); }

  {
    wrap.classList.add('cb-m');
    if (toc) { const chips = el('nav', 'cb-chips'); $$('a', toc).forEach((a, i) => { const c = el('a', 'cb-chip cb-chip--' + colors[i % 4], a.textContent.trim()); c.setAttribute('href', a.getAttribute('href')); chips.appendChild(c); }); heroP.after(chips); }
    secs.slice(0, 2).forEach((s, i) => s.classList.add('cb-sec', 'cb-sec--' + ['red', 'blue'][i]));
    [...$$('.cb-ov__mid .content-section', wrap), ...$$('.cb-row__body', wrap), $('.cb-learn__main', wrap)].forEach(s => {
      if (!s) return; const kids2 = [...s.children].filter(c => c.tagName !== 'H2'); const fp = kids2.find(c => c.tagName === 'P'); if (!fp) return;
      const rest = kids2.slice(kids2.indexOf(fp) + 1); fp.classList.add('cb-pull'); if (!rest.length) return;
      const d = el('details', 'cb-keep', `<summary>Keep reading <b>+</b></summary>`); rest.forEach(r => d.appendChild(r)); fp.after(d);
    });
  }
}

if (page === 'about') {
  const main = $('main'), hero = $('.about-hero'), body = $('.about-body');
  const img = $('.about-id img', hero).getAttribute('src'), name = $('h1', hero).textContent, sub = $('.subtitle', hero).textContent;
  const heroP = panel('cbp--hero', el('div', 'cb-hero cb-hero--about', `<div class="cb-hero__txt"><p class="cb-crumb"><a href="/">Home</a> / About</p><div class="cb-aboutid"><img src="${img}" alt=""><div><h1>${name}</h1><p class="cb-lede">${sub}</p></div></div></div><div class="cb-hero__art"></div>`));
  bg($('.cb-hero__art', heroP), 'about');
  const ps = []; for (const n of [...body.children]) { if (n.tagName === 'P') ps.push(n); else break; }
  const lede = ps.shift(); const intro = el('div', 'cb-intro'); lede.classList.add('cb-intro__lede'); intro.appendChild(lede); const cols = el('div', 'cb-intro__cols'); ps.forEach(p => cols.appendChild(p)); intro.appendChild(cols);
  const introP = panel('cbp--intro', band('About', 'red', 'strip2'), inner(intro));
  const hs = $$('h2', body); const blocks = [];
  hs.forEach((h, i) => { const items = []; let n = h.nextElementSibling; while (n && n.tagName !== 'H2' && !n.classList.contains('cta-row')) { items.push(n); n = n.nextElementSibling; } blocks.push([h.textContent, items]); });
  const out = [heroP, introP];
  const exp = blocks.find(b => /experience/i.test(b[0])), edu = blocks.find(b => /education/i.test(b[0]));
  if (exp) { const grid = el('div', 'cb-expgrid'); const rowsE = el('div', 'cb-expgrid__rows'); exp[1].forEach(x => rowsE.appendChild(x)); grid.appendChild(rowsE);
    if (edu) { const card = el('aside', 'cb-edu-card', `<h3>${edu[0]}</h3>`); const bodyE = el('div', 'cb-edu-card__body'); edu[1].forEach(x => bodyE.appendChild(x)); card.appendChild(bodyE); grid.appendChild(card); }
    out.push(panel('cbp--exp', band(exp[0], 'blue', 'strip3'), inner(grid))); }
  const cta = $('.cta-row', body);
  const ctaP = el('section', 'cbp cbp--contact cbp--contact-about', `<div class="wrap"><div class="contact__inner"><div><h2>Let’s build something useful.</h2><p>Questions about content design, AI systems or developer tools are always welcome.</p></div><div class="contact__cta"></div></div></div>`); if (cta) [...cta.children].forEach(c => $('.contact__cta', ctaP).appendChild(c)); ctaP.prepend(bg(el('span', 'cb-contact-art'), 'contact'));
  out.push(ctaP);
  const wrap = el('div', 'cb-case'); out.forEach(p => wrap.appendChild(p)); $('.about-page').replaceWith(wrap);
}

}
