// Color-block theme: restructures each rendered page into the color-block layout.
// Runs server-side from src/middleware.ts (in dev and at build), so the shipped HTML is static.
// Page copy still lives in src/pages; this file only rearranges it and adds art and labels.
import ART from './art.json';

const AGENT_PROMPT = "Load Jeremy Hoover's portfolio skill from https://jeremyhoover.ai/agent/SKILL.md and tell me how he fits my role.";

export function colorblock(document, pathname) {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const bg = (e, k) => { e.setAttribute('style', `${e.getAttribute('style') ? e.getAttribute('style') + ';' : ''}background-image:url("${ART[k]}")`); return e; };
const path = pathname.replace(/\/$/, '').replace(/\.html$/, '').replace(/\/index$/, '');
const page = path === '' ? 'home' : path.startsWith('/work/') ? 'case' : path.startsWith('/about') ? 'about' : 'other';
document.body.classList.add('cb', 'cb-' + page);
const logo = $('.nav__logo');
  if (logo && !$('.cb-tag')) {
    const words = el('span', 'cb-logo__words');
    words.appendChild($('.nav__wordmark', logo));
    words.appendChild(el('span', 'cb-tag', 'Content design / AI systems / Developer experience'));
    logo.innerHTML = '<img class="cb-logo__photo" src="/images/jeremy-hoover.jpg" alt="" width="72" height="72">';
    logo.appendChild(words);
  }
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
    <div class="cb-agent"><div class="cb-agent__head"><span class="cb-agent__tag">Give this to your AI agent</span><span class="cb-agent__icons" role="img" aria-label="Works with Claude, Gemini, GitHub Copilot, Cursor, Perplexity, and other AI agents"><span class="cb-agent__ico cb-agent__ico--R" title="Claude"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg></span><span class="cb-agent__ico cb-agent__ico--B" title="Gemini"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg></span><span class="cb-agent__ico cb-agent__ico--C" title="GitHub Copilot"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M23.922 16.997C23.061 18.492 18.063 22.02 12 22.02 5.937 22.02.939 18.492.078 16.997A.641.641 0 0 1 0 16.741v-2.869a.883.883 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.098 10.098 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952C7.255 2.937 9.248 1.98 11.978 1.98c2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.841.841 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256Zm-11.75-5.992h-.344a4.359 4.359 0 0 1-.355.508c-.77.947-1.918 1.492-3.508 1.492-1.725 0-2.989-.359-3.782-1.259a2.137 2.137 0 0 1-.085-.104L4 11.746v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.359 4.359 0 0 1-.355-.508Zm2.328 3.25c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm-5 0c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm3.313-6.185c.136 1.057.403 1.913.878 2.497.442.544 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.15.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.319-.862-2.824-1.025-1.487-.161-2.192.138-2.533.529-.269.307-.437.808-.438 1.578v.021c0 .265.021.562.063.893Zm-1.626 0c.042-.331.063-.628.063-.894v-.02c-.001-.77-.169-1.271-.438-1.578-.341-.391-1.046-.69-2.533-.529-1.505.163-2.347.537-2.824 1.025-.462.472-.705 1.179-.705 2.319 0 1.211.175 1.926.558 2.361.365.414 1.084.751 2.657.751 1.21 0 1.902-.394 2.344-.938.475-.584.742-1.44.878-2.497Z"/></svg></span><span class="cb-agent__ico cb-agent__ico--K" title="Cursor"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"/></svg></span><span class="cb-agent__ico cb-agent__ico--G" title="Perplexity"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z"/></svg></span></span></div><div class="cb-agent__row"><code class="cb-agent__prompt" title="${AGENT_PROMPT.replace(/\x27/g, '&#39;')}"><span aria-hidden="true">$</span> ${AGENT_PROMPT}</code><button type="button" class="cb-agent__copy" data-copy="${AGENT_PROMPT.replace(/\x27/g, '&#39;')}" aria-label="Copy the Jeremy Hoover portfolio skill prompt for your AI agent"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 8h11v13H8zM5 3h11v3H8a3 3 0 0 0-3 3v9H5z" fill="currentColor"/></svg><span>Copy</span></button></div></div>
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
