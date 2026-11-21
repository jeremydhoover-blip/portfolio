// Puzzle case study: the same glass-and-lead sheet as the home page, built from a case study page's own copy.
// Hero: title + at-a-glance + outcomes + chapter links. Body: each section is a colored heading piece
// locked beside a reading piece; figures become pieces whose steps are panes. Ends with the next case study.
import { PUZZLE_JS } from './puzzle.mjs';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const RING = ['R', 'G', 'Y', 'B'];

export function puzzleCase(document) {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const T = (e) => (e ? e.textContent.trim() : '');
  const art = $('article.case-study'); if (!art) return false;
  const hm = $('.case-hero__main'), shell = $('.case-shell');
  const back = $('.back', hm)?.getAttribute('href') || '/#projects';
  const h1 = T($('h1', hm)), lede = T($('.lede', hm));
  const outcomes = $$('.outcomes-strip .outcome').map((o) => ({ n: T($('.outcome__num', o)), l: T($('.outcome__label', o)) }));
  const glance = $$('.glance > div').map((d) => ({ dt: T($('dt', d)), dd: T($('dd', d)) }));
  const disc = T($('.disclosure p', shell));
  const toc = $$('.case-toc a', shell).map((a) => ({ href: a.getAttribute('href'), t: T(a) }));
  const nextSys = $('.next-system', shell);
  const pag = $('.case-pagination', shell);
  const nx = pag && $('.case-pagination__link--next', pag);

  const P = []; // pieces: [html]
  const piece = (cls, c, span, inner, extra = '') => `<div class="pc ${cls}" data-c="${c}" style="grid-column:span ${span}"${extra}>${inner}</div>`;
  const group = (cls, c, span, zones, extra = ' data-calm="1"') => `<div class="pc pz-group ${cls}" data-c="${c}" style="grid-column:span ${span}"${extra}>${zones.map(([z, h, zc = '']) => `<div class="z pz-zone ${zc}" data-z="${z}">${h}</div>`).join('')}</div>`;

  // HERO
  P.push(piece('pzc-title', 'B', 8, `<a class="pzc-back" href="${esc(back)}">← All work</a><h1 class="pz-serif pzc-h1">${esc(h1)}</h1><p class="pzc-lede lede">${esc(lede)}</p>`));
  P.push(piece('pzc-glance', 'Y', 4, `<dl class="glance">${glance.map((g) => `<div><dt>${esc(g.dt)}</dt><dd>${esc(g.dd)}</dd></div>`).join('')}</dl>${disc ? `<p class="pzc-disc">${esc(disc)}</p>` : ''}`, ' data-keep="1"'));
  const oc = ['R', 'G', 'B'];
  outcomes.slice(0, 3).forEach((o, i) => P.push(piece('pzc-out outcome', oc[i], 4, `<p class="pz-serif pzc-out__n outcome__num">${esc(o.n)}</p><p class="pzc-out__l outcome__label">${esc(o.l)}</p>`, ' data-thick="70"')));
  if (toc.length) P.push(group('pzc-toc', 'Y', 12, toc.map((t, i) => [['Y', 'C', 'Y', 'C', 'Y', 'C'][i % 6], `<a href="${esc(t.href)}"><b>${String(i + 1).padStart(2, '0')}</b>${esc(t.t)}</a>`])));

  // BODY
  let n = 0, f = 0;
  const kids = [...shell.children];
  const SKIP = ['case-toc', 'disclosure', 'case-pagination', 'divider', 'next-system'];
  const isNum = (e) => e && /^\s*\d+\s*$/.test(e.textContent);
  // one item of a flow or grid: number, title, description
  const item = (e, i) => { const kidsE = [...e.children]; const num = kidsE.find(isNum); const st = $('strong, h3', e);
    const desc = kidsE.filter((c) => c !== num && c !== st && !c.contains(st)).map(T).join(' ');
    return { n: T(num) || String(i + 1), t: T(st), d: desc }; };
  const capOf = (fig) => { const cap = $(':scope > figcaption', fig); if (!cap) return ''; const st = $('strong', cap); const rest = T(cap).replace(T(st), '').trim();
    return `<p class="pzc-cap">${st ? `<strong>${esc(T(st))}</strong> ` : ''}${esc(rest)}</p>`; };
  const steps = (els, cls) => els.map((e, i) => { const it = item(e, i); return [RING[(i + f) % 4], `<b class="pzc-step__n">${esc(it.n.padStart(2, '0'))}</b><strong>${esc(it.t)}</strong><small>${esc(it.d)}</small>`, 'pzc-step']; });
  const withCap = (cap, zones) => (cap ? [['C', cap, 'pzc-capz'], ...zones] : zones);
  const gridGroup = (els, cap) => group('pzc-flow pzc-flow--' + els.length, 'C', 12, withCap(cap, steps(els)));
  const btns = (scope) => $$('a', scope).map((a, i) => `<a class="pz-btn${i ? ' pz-btn--light' : ''}" href="${esc(a.getAttribute('href'))}"${a.getAttribute('target') ? ' target="_blank" rel="noopener"' : ''}>${esc(T(a))} ↗</a>`).join('');
  // a block that isn't plain reading text becomes its own piece (or pieces)
  const block = (k) => {
    const cl = k.classList;
    if (cl.contains('impact-grid') || cl.contains('conditions-grid') || cl.contains('evolution-grid')) return [gridGroup([...k.children], '')];
    if (cl.contains('proof-list')) return [group('pzc-proof pzc-flow--' + k.children.length, 'C', 12, [...k.children].map((a, i) => [RING[(i + 1) % 4], `<a href="${esc(a.getAttribute('href'))}" target="_blank" rel="noopener"><span class="pzc-tag">${esc(T($('span', a)))}</span><strong>${esc(T($('strong', a)))} ↗</strong><small>${esc(T($('small', a)))}</small></a>`, 'pzc-step']))];
    if (cl.contains('response-quote')) return [piece('pzc-quote', 'Y', 12, `<blockquote class="pz-serif">${esc(T($('blockquote', k)))}</blockquote><p class="pzc-quote__by"><strong>${esc(T($('figcaption strong', k)))}</strong> · ${esc(T($('figcaption span', k)))}</p>`)];
    if (k.tagName === 'FIGURE') {
      const cap = capOf(k); f++;
      const ol = $('ol', k), cmp = $('.workflow-compare, .before-after', k), grid = $('.architecture, .system-grid', k), chat = $('.conversation', k), img = $('img', k);
      if (ol && !cmp) return [gridGroup([...ol.children], cap)];
      if (grid) return [gridGroup([...grid.children], cap)];
      if (cmp) { const side = (p) => `<span class="pzc-tag">${esc(T($('.diagram-label, .ba-label', p)))}</span><h3 class="pz-serif">${esc(T($('h3', p)))}</h3>${$$('.tool-row span', p).length ? `<p class="pzc-tools">${$$('.tool-row span', p).map((t) => `<span>${esc(T(t))}</span>`).join('')}</p>` : ''}<ul>${$$('li', p).map((li) => `<li>${esc(T(li))}</li>`).join('')}</ul>`;
        const [b, a] = $$('.workflow-panel, .ba-panel', cmp); return [group('pzc-ba', 'C', 12, withCap(cap, [['R', side(b), 'pzc-ba__b'], ['G', side(a), 'pzc-ba__a']]))]; }
      if (chat) { const rows = [...chat.children].map((m) => m.classList.contains('report-preview')
          ? `<div class="pzc-chat__rep"><span class="pzc-tag">${esc(T($('span', m)))}</span><strong>${esc(T($('strong', m)))}</strong><p>${esc(T($('p', m)))}</p></div>`
          : `<div class="pzc-chat__row${m.classList.contains('message--agent') ? ' is-agent' : ''}"><b>${esc(T($('span', m)))}</b><p>${esc(T($('p', m)))}</p></div>`).join('');
        return [group('pzc-chat', 'C', 12, withCap(cap, [['B', rows, 'pzc-chat__z']]))]; }
      if (img) return [group('pzc-img', 'C', 12, [['C', '', 'pzc-img__z'], ['Y', cap, 'pzc-img__cap']]).replace('class="z pz-zone pzc-img__z" data-z="C"', `class="z pz-zone pzc-img__z" data-z="C" data-img="${esc(img.getAttribute('src'))}" role="img" aria-label="${esc(img.getAttribute('alt'))}"`)];
      return [];
    }
    if (cl.contains('closing-panel') || cl.contains('inspect-work') || cl.contains('pattern-cta')) return [piece('pzc-nextsys', RING[n % 4], 12, `<h2 class="pz-serif pzc-h2">${esc(T($('h2', k)))}</h2><p class="pzc-lede">${esc(T($('p', k)))}</p>${btns(k) ? `<p class="pzc-btns">${btns(k)}</p>` : ''}`)];
    return null; // plain reading content
  };
  const SPECIAL = '.impact-grid, .conditions-grid, .evolution-grid, .proof-list, .response-quote, figure';
  const section = (k) => {
    const h2 = $('h2', k); const head = T(h2); if (h2) h2.remove();
    const extra = []; $$(SPECIAL, k).forEach((x) => { if (x.parentElement.closest(SPECIAL)) return; extra.push(...(block(x) || [])); x.remove(); });
    const text = k.innerHTML.trim();
    if (head) {
      const c = RING[n % 4], left = n % 2 === 0;
      const hz = [c, `<span class="pzc-num">${String(n + 1).padStart(2, '0')}</span><h2 class="pz-serif pzc-h2">${esc(head)}</h2>`, 'pzc-head'], tz = ['C', `<div class="pzc-prose">${text}</div>`, 'pzc-text'];
      P.push(group('pzc-sec' + (left ? '' : ' pzc-sec--r'), c, 12, left ? [hz, tz] : [tz, hz], ' data-calm="1"' + (k.id ? ` id="${esc(k.id)}"` : ''))); n++;
    } else if (T(k)) P.push(piece('pzc-text pzc-text--wide', 'C', 12, `<div class="pzc-prose">${text}</div>`, ' data-keep="1" data-thick="90"'));
    P.push(...extra);
  };
  kids.forEach((k) => {
    if (k.tagName === 'HR' || SKIP.some((c) => k.classList.contains(c))) return;
    if (k.classList.contains('content-section') || k.classList.contains('reading-column')) return section(k);
    const b = block(k); if (b) P.push(...b);
  });
  if (nextSys) P.push(piece('pzc-nextsys', RING[n % 4], 12, `<h2 class="pz-serif pzc-h2">${esc(T($('h2', nextSys)))}</h2><p class="pzc-lede">${esc(T($('p', nextSys)))}</p>`));
  // NEXT: all work, previous and next case study
  const links = pag ? $$('.case-pagination__link', pag).map((l) => ({ href: l.getAttribute('href'), dir: T($('.case-pagination__direction', l)), t: T($('.case-pagination__title', l)), next: l.classList.contains('case-pagination__link--next') })) : [];
  const prev = links.find((l) => /previous/i.test(l.dir)), nxt = links.find((l) => l.next);
  const navZ = [['Y', `<a class="pzc-back" href="/#projects">← All work</a>`, 'pzc-next__back']];
  if (prev) navZ.push(['B', `<a class="pzc-next__a pzc-next__a--prev" href="${esc(prev.href)}"><span>Previous case study</span><strong class="pz-serif">← ${esc(prev.t)}</strong></a>`, 'pzc-next__prev']);
  if (nxt) navZ.push(['R', `<a class="pzc-next__a" href="${esc(nxt.href)}"><span>Next case study</span><strong class="pz-serif">${esc(nxt.t)} →</strong></a>`, 'pzc-next__go']);
  P.push(group('pzc-next pzc-next--' + navZ.length, 'R', 12, navZ));

  const pz = document.createElement('div');
  pz.className = 'pz pz--case'; pz.dataset.seed = '11';
  pz.innerHTML = P.join('\n');
  art.replaceWith(pz);
  document.body.classList.add('cb-home', 'pz-casepage');
  const s = document.createElement('script'); s.textContent = PUZZLE_JS; document.body.appendChild(s);
  return true;
}
