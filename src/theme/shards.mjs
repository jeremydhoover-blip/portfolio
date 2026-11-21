// Shard strips: the jagged, multi-colored edge that makes each section read as a piece of stained glass.
// Each strip is an inline SVG with an exact pixel height that stretches horizontally, so the
// pieces always line up with the section's flat main color below (or above) the jagged line.

const COLORS = { B: '#2d62c9', R: '#e1412e', Y: '#f4c21b', G: '#78b13b', K: '#141414', C: '#f6eedf' };
const PALETTE = ['B', 'R', 'Y', 'G'];

// Small deterministic random generator, so the same page always renders the same shapes.
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// pos: 'top' (pieces above the line, main color below) or 'bottom' (pieces below the line).
// main: the section's own color key, never reused for the pieces next to it.
export function shardStrip({ seed = 1, h = 64, main = 'C', pos = 'top', n = 7, w = 1440 } = {}) {
  const r = rng(seed);
  const xs = [0];
  for (let i = 1; i < n; i++) xs.push(Math.round((i / n) * w + (r() - 0.5) * (w / n) * 0.7));
  xs.push(w);
  // the jagged line: deep in some places, shallow in others
  const ys = xs.map(() => Math.round(h * (0.25 + r() * 0.7)));
  const line = xs.map((x, i) => [x, pos === 'top' ? ys[i] : h - ys[i]]);
  const edge = pos === 'top' ? 0 : h;
  let prev = null;
  const pick = (avoid) => { const opts = PALETTE.filter((c) => c !== main && c !== avoid); return opts[Math.floor(r() * opts.length)]; };
  let polys = '';
  for (let i = 0; i < line.length - 1; i++) {
    const [x0, y0] = line[i], [x1, y1] = line[i + 1];
    // the divider meets the outer edge a little off-vertical, so the pieces are never boxes
    const ex0 = i === 0 ? 0 : Math.round(x0 + (r() - 0.5) * 60), ex1 = i === line.length - 2 ? w : Math.round(x1 + (r() - 0.5) * 60);
    const c1 = pick(prev);
    if (r() < 0.45) {
      // split the piece diagonally into two colors
      const c2 = pick(c1);
      polys += `<polygon points="${x0},${y0} ${x1},${y1} ${ex1},${edge}" fill="${COLORS[c1]}"/>`;
      polys += `<polygon points="${x0},${y0} ${ex1},${edge} ${ex0},${edge}" fill="${COLORS[c2]}"/>`;
      prev = c2;
    } else {
      polys += `<polygon points="${x0},${y0} ${x1},${y1} ${ex1},${edge} ${ex0},${edge}" fill="${COLORS[c1]}"/>`;
      prev = c1;
    }
  }
  const lineStr = line.map((p) => p.join(',')).join(' ');
  return `<svg class="sh-strip sh-strip--${pos}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="height:${h}px" aria-hidden="true" focusable="false">`
    + `<g stroke="#141414" stroke-width="6" stroke-linejoin="round" vector-effect="non-scaling-stroke">${polys.replace(/<polygon /g, '<polygon vector-effect="non-scaling-stroke" ')}</g>`
    + `<polyline points="${lineStr}" fill="none" stroke="#141414" stroke-width="7" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
}

// Turn an element into a flat-color shard: its own color, plus a jagged strip of pieces along its top.
export function shard(el, { main = 'C', seed = 1, h = 64, n = 7, bottom = false } = {}) {
  if (!el) return el;
  el.classList.add('sh', `sh--${main}`);
  el.style && el.setAttribute('style', `${el.getAttribute('style') ? el.getAttribute('style') + ';' : ''}--sh-top:${h}px${bottom ? `;--sh-bottom:${Math.round(h * 0.7)}px` : ''}`);
  el.insertAdjacentHTML('afterbegin', shardStrip({ seed, h, main, pos: 'top', n }));
  if (bottom) el.insertAdjacentHTML('beforeend', shardStrip({ seed: seed + 97, h: Math.round(h * 0.7), main, pos: 'bottom', n }));
  return el;
}
