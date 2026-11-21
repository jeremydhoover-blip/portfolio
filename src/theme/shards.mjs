// Shards: every block on the page is one piece of stained glass. Its main shape is an irregular
// polygon with slanted sides, and the corners it leaves inside the block's box are filled with
// smaller colored slivers, all outlined in black lead lines. Blocks sit edge to edge, so the
// page reads as one tessellation, with nothing layered on top of anything else.
//
// The shapes are drawn in the browser (SHARD_JS) because they need each block's real size.
// They never go into the padding's text area: every slant stays inside the block's padding.
// Without JavaScript, each block is still its flat main color.

// Mark an element as a shard. `main` is its color key; `seed` makes the shapes repeatable.
export function shard(el, { main = 'C', seed = 1 } = {}) {
  if (!el) return el;
  el.classList.add('sh', `sh--${main}`);
  el.setAttribute('data-sh-main', main);
  el.setAttribute('data-sh-seed', String(seed));
  return el;
}

export const SHARD_JS = `(() => {
  const COL = { B: '#2d62c9', R: '#e1412e', Y: '#f4c21b', G: '#78b13b', C: '#f6eedf' };
  const PAL = ['B', 'R', 'Y', 'G'];
  const rng = (s) => { s = s >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const pts = (p) => p.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
  function draw(el) {
    const w = el.offsetWidth, h = el.offsetHeight;
    if (!w || !h) return;
    const key = w + 'x' + h;
    if (el._shKey === key) return;
    el._shKey = key;
    const r = rng(+el.dataset.shSeed || 1), main = el.dataset.shMain;
    const cs = getComputedStyle(el);
    // each slant stays inside the padding, so it never touches text
    const room = (v, cap) => Math.max(0, Math.min(cap, parseFloat(v) - 18));
    const small = w < 700;
    const lim = { t: room(cs.paddingTop, small ? 46 : 110), b: room(cs.paddingBottom, small ? 40 : 90),
      l: room(cs.paddingLeft, small ? 18 : 150), r: room(cs.paddingRight, small ? 18 : 150) };
    // per side: one end cut deep, the other shallow, so the side runs at an angle
    // no hairline slivers: an end is either flush (0) or cut at least a third of the room
    const side = (m) => { if (m < 24 || r() < 0.15) return [0, 0]; const deep = m * (0.7 + r() * 0.3), shallow = r() < 0.6 ? 0 : m * (0.3 + r() * 0.1); return r() < 0.5 ? [deep, shallow] : [shallow, deep]; };
    const [tL, tR] = side(lim.t), [bR, bL] = side(lim.b), [lT, lB] = side(lim.l), [rT, rB] = side(lim.r);
    const C = [[0, 0], [w, 0], [w, h], [0, h]];
    const P = [[lT, tL], [w - rT, tR], [w - rB, h - bR], [lB, h - bL]];
    let prev = null;
    const pick = () => { const o = PAL.filter((c) => c !== main && c !== prev); prev = o[Math.floor(r() * o.length)]; return prev; };
    const area = (p) => Math.abs(p.reduce((s, q, i) => { const n = p[(i + 1) % p.length]; return s + q[0] * n[1] - n[0] * q[1]; }, 0)) / 2;
    let polys = '';
    const add = (p, c) => { if (area(p) > 40) polys += '<polygon points="' + pts(p) + '" fill="' + COL[c] + '"/>'; };
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, piece = [C[i], C[j], P[j], P[i]];
      if (area(piece) < 40) continue;
      const len = Math.hypot(C[j][0] - C[i][0], C[j][1] - C[i][1]);
      const cuts = len > 900 ? 2 + Math.floor(r() * 2) : len > 380 ? 1 + Math.floor(r() * 2) : 0;
      // split long slivers into a few pieces with slanted cuts
      const fs = [0];
      for (let k = 1; k <= cuts; k++) fs.push(Math.min(0.95, Math.max(0.05, k / (cuts + 1) + (r() - 0.5) * 0.18)));
      fs.push(1);
      for (let k = 0; k < fs.length - 1; k++) {
        const a = fs[k], b = fs[k + 1], skA = k === 0 ? 0 : (r() - 0.5) * 0.12, skB = k === fs.length - 2 ? 0 : (r() - 0.5) * 0.12;
        add([lerp(C[i], C[j], a), lerp(C[i], C[j], b), lerp(P[i], P[j], Math.min(1, Math.max(0, b + skB))), lerp(P[i], P[j], Math.min(1, Math.max(0, a + skA)))], pick());
      }
    }
    polys += '<polygon points="' + pts(P) + '" fill="' + COL[main] + '"/>';
    let svg = el.querySelector(':scope > .sh-svg');
    if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'sh-svg'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false'); el.prepend(svg); }
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.innerHTML = '<g stroke="#141414" stroke-width="7" stroke-linejoin="round">' + polys + '</g><rect x="0" y="0" width="' + w + '" height="' + h + '" fill="none" stroke="#141414" stroke-width="7"/>';
  }
  const all = () => document.querySelectorAll('[data-sh-main]');
  const ro = 'ResizeObserver' in window ? new ResizeObserver((es) => es.forEach((e) => draw(e.target))) : null;
  const init = () => all().forEach((el) => { draw(el); if (ro) ro.observe(el); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => all().forEach(draw));
})();`;
