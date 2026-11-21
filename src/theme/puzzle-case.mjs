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
  P.push(piece('pzc-glance', 'Y', 4, `<dl class="glance">${glance.map((g) => `<div><dt>${esc(g.dt)}</dt><dd>${esc(g.dd)}</dd></div>`).join('')}</dl>`, ' data-keep="1"'));
  const oc = ['R', 'G', 'B'];
  outcomes.slice(0, 3).forEach((o, i) => P.push(piece('pzc-out outcome', oc[i], 4, `<p class="pz-serif pzc-out__n outcome__num">${esc(o.n)}</p><p class="pzc-out__l outcome__label">${esc(o.l)}</p>`, ' data-thick="70"')));
  if (toc.length) P.push(group('pzc-toc', 'Y', 12, toc.map((t, i) => [['Y', 'C', 'Y', 'C', 'Y', 'C'][i % 6], `<a href="${esc(t.href)}"><b>${String(i + 1).padStart(2, '0')}</b>${esc(t.t)}</a>`])));

  // BODY
  let n = 0;
  const kids = [...shell.children];
  const flowZones = (ol) => [...ol.children].map((li, i) => [RING[i % 4], `<b class="pzc-step__n">${String(i + 1).padStart(2, '0')}</b><strong>${esc(T($('strong', li)))}</strong><small>${esc(T($('small', li)))}</small>`, 'pzc-step']);
  kids.forEach((k) => {
    if (k.classList.contains('content-section')) {
      const h2 = $('h2', k); const head = T(h2); if (h2) h2.remove();
      // impact grids inside a section become their own piece after it
      const grid = $('.impact-grid', k); if (grid) grid.remove();
      const c = RING[n % 4], left = n % 2 === 0;
      const headP = piece(left ? 'pzc-head' : 'pzc-head pzc-head--r', c, 4, `<span class="pzc-num">${String(n + 1).padStart(2, '0')}</span><h2 class="pz-serif pzc-h2">${esc(head)}</h2>`, ' data-thick="80"' + (k.id ? ` id="${esc(k.id)}"` : ''));
      const textP = piece(left ? 'pzc-text' : 'pzc-text pzc-text--l', 'C', 8, `<div class="pzc-prose">${k.innerHTML}</div>`, ' data-keep="1" data-thick="90"');
      P.push(headP + textP);
      if (grid) P.push(group('pzc-impact', 'G', 12, [...grid.children].map((d, i) => [['G', 'Y', 'R'][i % 3], `<strong>${esc(T($('strong', d)))}</strong><span>${esc(T($('span', d)))}</span>`])));
      n++;
    } else if (k.classList.contains('evidence-figure')) {
      const cap = $('figcaption', k); const capH = cap ? `<p class="pzc-cap"><strong>${esc(T($('strong', cap)))}</strong> ${esc(T(cap).replace(T($('strong', cap)), '').trim())}</p>` : '';
      const ol = $('ol', k), cmp = $('.workflow-compare', k);
      if (ol) P.push(group('pzc-flow pzc-flow--' + ol.children.length, 'C', 12, [['C', capH, 'pzc-capz'], ...flowZones(ol)]));
      else if (cmp) {
        const side = (p) => `<span class="pzc-tag">${esc(T($('.diagram-label', p)))}</span><h3 class="pz-serif">${esc(T($('h3', p)))}</h3><ul>${$$('li', p).map((li) => `<li>${esc(T(li))}</li>`).join('')}</ul>`;
        const [b, a] = $$('.workflow-panel', cmp);
        P.push(group('pzc-ba', 'C', 12, [['C', capH, 'pzc-capz'], ['R', side(b), 'pzc-ba__b'], ['G', side(a), 'pzc-ba__a']]));
      }
    }
  });
  if (nextSys) P.push(piece('pzc-nextsys', RING[n % 4], 12, `<h2 class="pz-serif pzc-h2">${esc(T($('h2', nextSys)))}</h2><p class="pzc-lede">${esc(T($('p', nextSys)))}</p>`));
  // NEXT
  if (nx) P.push(group('pzc-next', 'R', 12, [['Y', `<a class="pzc-back" href="/#projects">← All work</a>`, 'pzc-next__back'], ['R', `<a class="pzc-next__a" href="${esc(nx.getAttribute('href'))}"><span>Next case study</span><strong class="pz-serif">${esc(T($('.case-pagination__title', nx)))} →</strong></a>`, 'pzc-next__go']]));

  const pz = document.createElement('div');
  pz.className = 'pz pz--case'; pz.dataset.seed = '11';
  pz.innerHTML = P.join('\n');
  art.replaceWith(pz);
  document.body.classList.add('cb-home', 'pz-casepage');
  const s = document.createElement('script'); s.textContent = PUZZLE_JS; document.body.appendChild(s);
  return true;
}
