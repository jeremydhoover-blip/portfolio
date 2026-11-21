// Color-block theme: restructures each rendered page into the color-block layout.
// Runs server-side from src/middleware.ts (in dev and at build), so the shipped HTML is static.
// Page copy still lives in src/pages; this file only rearranges it and adds art and labels.
import ART from './art.json';
import { puzzleCase, puzzleAbout } from './puzzle-case.mjs';
import { shard, SHARD_JS } from './shards.mjs';
import { puzzleHome } from './puzzle.mjs';

const AGENT_PROMPT = "Check how Jeremy Hoover fits my role: https://jeremyhoover.ai/agent/SKILL.md";

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
    // the photo is set into a glass pane, with three small colored panes leaded around it
    logo.innerHTML = `<svg class="cb-logo__photo" viewBox="0 0 104 92" width="104" height="92" aria-hidden="true" focusable="false"><defs><clipPath id="cb-ph"><path d="M7 4L80 2L85 88L3 86Z"/></clipPath></defs>
      <g stroke="#141414" stroke-width="3.5" stroke-linejoin="round"><path d="M80 2L101 7L99 47L82.6 42.5Z" fill="#f4c21b"/><path d="M82.6 42.5L99 47L97 89L85 88Z" fill="#e1412e"/>
      <image href="/images/jeremy-hoover.jpg" x="1" y="1" width="86" height="86" preserveAspectRatio="xMidYMin slice" clip-path="url(#cb-ph)"/><path d="M7 4L80 2L85 88L3 86Z" fill="none"/></g></svg>`;
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
    <a class="cb-tile cb-tile--side" href="${c1.getAttribute('href')}"><span class="cb-tile__art"></span><span class="cb-tile__txt cb-tile__txt--green"><span class="cb-kicker">Microsoft · Hackathon winner</span><strong>${$('h3', c1).textContent}</strong><span class="cb-sub">${pt(c1)}</span><span class="cb-link">Read the story ↗</span></span></a>
  </div>`);
  const arts = $$('.cb-tile__art', feat); bg(arts[0], 'hero'); bg(arts[1], 'tile-fievel'); bg(arts[2], 'tile-hackathon');
  const note = el('section', 'cb-note', `<em>A note from Jeremy</em><span class="cb-note__txt"><h1 class="cb-note__h1">${$('.hero__name', hero).textContent}</h1> ${$('.hero__pitch', hero).textContent}</span><a href="#projects">More case studies ↓</a><a href="/about">About me ↗</a>`);
  hero.replaceWith(feat); feat.after(note);
  // the agent prompt gets its own band after the case-study list, so it doesn't stack on the note
  const agentBand = el('section', 'cb-agentband', `<div class="cb-agent"><div class="cb-agent__head"><span class="cb-agent__tag">Give this to your AI agent</span><span class="cb-agent__icons" role="img" aria-label="Works with Claude, ChatGPT, Codex, Gemini, GitHub Copilot, Cursor, and Windsurf"><span class="cb-agent__ico" title="Claude"><svg width="18" height="18" aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" fill="#D97757" fill-rule="nonzero"></path></svg></span><span class="cb-agent__ico" title="ChatGPT"><svg width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor" fill-rule="evenodd" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"></path></svg></span><span class="cb-agent__ico" title="Codex"><svg width="18" height="18" aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.503 0H4.496A4.496 4.496 0 000 4.496v15.007A4.496 4.496 0 004.496 24h15.007A4.496 4.496 0 0024 19.503V4.496A4.496 4.496 0 0019.503 0z" fill="#fff"></path><path d="M9.064 3.344a4.578 4.578 0 012.285-.312c1 .115 1.891.54 2.673 1.275.01.01.024.017.037.021a.09.09 0 00.043 0 4.55 4.55 0 013.046.275l.047.022.116.057a4.581 4.581 0 012.188 2.399c.209.51.313 1.041.315 1.595a4.24 4.24 0 01-.134 1.223.123.123 0 00.03.115c.594.607.988 1.33 1.183 2.17.289 1.425-.007 2.71-.887 3.854l-.136.166a4.548 4.548 0 01-2.201 1.388.123.123 0 00-.081.076c-.191.551-.383 1.023-.74 1.494-.9 1.187-2.222 1.846-3.711 1.838-1.187-.006-2.239-.44-3.157-1.302a.107.107 0 00-.105-.024c-.388.125-.78.143-1.204.138a4.441 4.441 0 01-1.945-.466 4.544 4.544 0 01-1.61-1.335c-.152-.202-.303-.392-.414-.617a5.81 5.81 0 01-.37-.961 4.582 4.582 0 01-.014-2.298.124.124 0 00.006-.056.085.085 0 00-.027-.048 4.467 4.467 0 01-1.034-1.651 3.896 3.896 0 01-.251-1.192 5.189 5.189 0 01.141-1.6c.337-1.112.982-1.985 1.933-2.618.212-.141.413-.251.601-.33.215-.089.43-.164.646-.227a.098.098 0 00.065-.066 4.51 4.51 0 01.829-1.615 4.535 4.535 0 011.837-1.388zm3.482 10.565a.637.637 0 000 1.272h3.636a.637.637 0 100-1.272h-3.636zM8.462 9.23a.637.637 0 00-1.106.631l1.272 2.224-1.266 2.136a.636.636 0 101.095.649l1.454-2.455a.636.636 0 00.005-.64L8.462 9.23z" fill="url(#ai-codex-color-lobe-icons-codex-_R_0_)"></path><defs><linearGradient gradientUnits="userSpaceOnUse" id="ai-codex-color-lobe-icons-codex-_R_0_" x1="12" x2="12" y1="3" y2="21"><stop stop-color="#B1A7FF"></stop><stop offset=".5" stop-color="#7A9DFF"></stop><stop offset="1" stop-color="#3941FF"></stop></linearGradient></defs></svg></span><span class="cb-agent__ico" title="Gemini"><svg width="18" height="18" aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="#3186FF"></path><path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#ai-gemini-color-lobe-icons-gemini-0-_R_0_)"></path><path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#ai-gemini-color-lobe-icons-gemini-1-_R_0_)"></path><path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#ai-gemini-color-lobe-icons-gemini-2-_R_0_)"></path><defs><linearGradient gradientUnits="userSpaceOnUse" id="ai-gemini-color-lobe-icons-gemini-0-_R_0_" x1="7" x2="11" y1="15.5" y2="12"><stop stop-color="#08B962"></stop><stop offset="1" stop-color="#08B962" stop-opacity="0"></stop></linearGradient><linearGradient gradientUnits="userSpaceOnUse" id="ai-gemini-color-lobe-icons-gemini-1-_R_0_" x1="8" x2="11.5" y1="5.5" y2="11"><stop stop-color="#F94543"></stop><stop offset="1" stop-color="#F94543" stop-opacity="0"></stop></linearGradient><linearGradient gradientUnits="userSpaceOnUse" id="ai-gemini-color-lobe-icons-gemini-2-_R_0_" x1="3.5" x2="17.5" y1="13.5" y2="12"><stop stop-color="#FABC12"></stop><stop offset=".46" stop-color="#FABC12" stop-opacity="0"></stop></linearGradient></defs></svg></span><span class="cb-agent__ico" title="GitHub Copilot"><svg width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor" fill-rule="evenodd" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.245 5.364c1.322 1.36 1.877 3.216 2.11 5.817.622 0 1.2.135 1.592.654l.73.964c.21.278.323.61.323.955v2.62c0 .339-.173.669-.453.868C20.239 19.602 16.157 21.5 12 21.5c-4.6 0-9.205-2.583-11.547-4.258-.28-.2-.452-.53-.453-.868v-2.62c0-.345.113-.679.321-.956l.73-.963c.392-.517.974-.654 1.593-.654l.029-.297c.25-2.446.81-4.213 2.082-5.52 2.461-2.54 5.71-2.851 7.146-2.864h.198c1.436.013 4.685.323 7.146 2.864zm-7.244 4.328c-.284 0-.613.016-.962.05-.123.447-.305.85-.57 1.108-1.05 1.023-2.316 1.18-2.994 1.18-.638 0-1.306-.13-1.851-.464-.516.165-1.012.403-1.044.996a65.882 65.882 0 00-.063 2.884l-.002.48c-.002.563-.005 1.126-.013 1.69.002.326.204.63.51.765 2.482 1.102 4.83 1.657 6.99 1.657 2.156 0 4.504-.555 6.985-1.657a.854.854 0 00.51-.766c.03-1.682.006-3.372-.076-5.053-.031-.596-.528-.83-1.046-.996-.546.333-1.212.464-1.85.464-.677 0-1.942-.157-2.993-1.18-.266-.258-.447-.661-.57-1.108-.32-.032-.64-.049-.96-.05zm-2.525 4.013c.539 0 .976.426.976.95v1.753c0 .525-.437.95-.976.95a.964.964 0 01-.976-.95v-1.752c0-.525.437-.951.976-.951zm5 0c.539 0 .976.426.976.95v1.753c0 .525-.437.95-.976.95a.964.964 0 01-.976-.95v-1.752c0-.525.437-.951.976-.951zM7.635 5.087c-1.05.102-1.935.438-2.385.906-.975 1.037-.765 3.668-.21 4.224.405.394 1.17.657 1.995.657h.09c.649-.013 1.785-.176 2.73-1.11.435-.41.705-1.433.675-2.47-.03-.834-.27-1.52-.63-1.813-.39-.336-1.275-.482-2.265-.394zm6.465.394c-.36.292-.6.98-.63 1.813-.03 1.037.24 2.06.675 2.47.968.957 2.136 1.104 2.776 1.11h.044c.825 0 1.59-.263 1.995-.657.555-.556.765-3.187-.21-4.224-.45-.468-1.335-.804-2.385-.906-.99-.088-1.875.058-2.265.394zM12 7.615c-.24 0-.525.015-.84.044.03.16.045.336.06.526l-.001.159a2.94 2.94 0 01-.014.25c.225-.022.425-.027.612-.028h.366c.187 0 .387.006.612.028-.015-.146-.015-.277-.015-.409.015-.19.03-.365.06-.526a9.29 9.29 0 00-.84-.044z"></path></svg></span><span class="cb-agent__ico" title="Cursor"><svg width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor" fill-rule="evenodd" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z"></path></svg></span><span class="cb-agent__ico" title="Windsurf"><svg width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor" fill-rule="evenodd" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M23.78 5.004h-.228a2.187 2.187 0 00-2.18 2.196v4.912c0 .98-.804 1.775-1.76 1.775a1.818 1.818 0 01-1.472-.773L13.168 5.95a2.197 2.197 0 00-1.81-.95c-1.134 0-2.154.972-2.154 2.173v4.94c0 .98-.797 1.775-1.76 1.775-.57 0-1.136-.289-1.472-.773L.408 5.098C.282 4.918 0 5.007 0 5.228v4.284c0 .216.066.426.188.604l5.475 7.889c.324.466.8.812 1.351.938 1.377.316 2.645-.754 2.645-2.117V11.89c0-.98.787-1.775 1.76-1.775h.002c.586 0 1.135.288 1.472.773l4.972 7.163a2.15 2.15 0 001.81.95c1.158 0 2.151-.973 2.151-2.173v-4.939c0-.98.787-1.775 1.76-1.775h.194c.122 0 .22-.1.22-.222V5.225a.221.221 0 00-.22-.222z"></path></svg></span></span></div><div class="cb-agent__row"><code class="cb-agent__prompt" title="${AGENT_PROMPT.replace(/\x27/g, '&#39;')}"><span aria-hidden="true">$</span> ${AGENT_PROMPT}</code><button type="button" class="cb-agent__copy" data-copy="${AGENT_PROMPT.replace(/\x27/g, '&#39;')}" aria-label="Copy the Jeremy Hoover portfolio skill prompt for your AI agent"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 8h11v13H8zM5 3h11v3H8a3 3 0 0 0-3 3v9H5z" fill="currentColor"/></svg><span>Copy</span></button></div></div>`);
  // the home page is one puzzle of glass pieces now (src/theme/puzzle.mjs); the older block layout below no longer runs for it
  puzzleHome(document, { prompt: AGENT_PROMPT, icons: $('.cb-agent__icons', agentBand).outerHTML, name: $('.hero__name', hero).textContent.trim(), pitch: $('.hero__pitch', hero).textContent.trim() }); return;
  $('.projects')?.after(agentBand);
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
  if (puzzleCase(document)) return;
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
  if (puzzleAbout(document)) return;
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

// Shard layout: every block is a flat-color shard with a jagged, multi-colored top edge.
// One layer only: the pieces and the block's own color tile together along black lead lines.
const SH = [
  ['.cb-tile--big', 'B', 84], ['.cb-feat .cb-tile--side:nth-of-type(2)', 'Y', 64], ['.cb-feat .cb-tile--side:nth-of-type(3)', 'G', 64],
  ['main > .cb-note', 'C', 44], ['.cb-agentband .cb-agent', 'R', 56],
  ['main > .projects', 'B', 70], ['main > .program', 'Y', 70], ['main > .writing', 'C', 70], ['main > .experience', 'C', 70],
  ['main > .recommendations', 'C', 70], ['main > .hcs', 'C', 70], ['main > .contact', 'R', 70],
  ['.cb-case > .cbp--hero .cb-hero__txt', 'B', 70], ['.cb-case > .cbp--ship', 'Y', 64], ['.cb-case > .cbp--contact', 'R', 64], ['.cb-case > .cbp', 'C', 64],
];
let seed = 11;
for (const [sel, main] of SH) for (const e of $$(sel)) { if (e.classList.contains('sh') || e.classList.contains('cbp--hero')) continue; shard(e, { main, seed: seed += 7 }); }
if ($$('.sh').length) { const s = document.createElement('script'); s.textContent = SHARD_JS; document.body.appendChild(s); }

}
