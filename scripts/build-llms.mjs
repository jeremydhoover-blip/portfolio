// Builds llms.txt and agent/profile.json (the data behind public/agent/SKILL.md): a plain-text summary of the portfolio that someone can hand to an AI agent.
// Reads the built pages in dist/, so run it after `astro build` (npm run build does this).
// Writes dist/llms.txt for the deployed site and public/llms.txt so `npm run dev` serves it too.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { parseHTML } from 'linkedom';

const SITE = 'https://jeremyhoover.ai';
const CASES = ['ai-design-repo', 'hackathon', 'org-ai-initiatives', 'fabric-cli', 'statecraft-israel', 'wix-accessibility'];
const load = (p) => parseHTML(readFileSync(new URL(`../dist/${p}`, import.meta.url), 'utf8')).document;
const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const all = (doc, sel) => [...doc.querySelectorAll(sel)];

const out = [];
const data = { name: 'Jeremy Hoover', title: 'Senior Content Designer, AI systems and developer experience', site: SITE, skill: `${SITE}/agent/SKILL.md`, llms: `${SITE}/llms.txt`, generated: new Date().toISOString().slice(0, 10), caseStudies: [], experience: [], recognition: [], articles: [] };
const home = load('index.html');
out.push('# Jeremy Hoover', '');
data.headline = txt(home.querySelector('.cb-note__txt')) || [txt(home.querySelector('.pz-note__h1')), txt(home.querySelector('.pz-note__p'))].filter(Boolean).join(' ') || txt(home.querySelector('h1'));
out.push(`> ${data.headline}`, '');
out.push('Senior Content Designer at Microsoft working on AI systems and developer experience. This file summarizes his portfolio for AI agents and recruiters. Every case study links to the full page.', '');
out.push(`For agents: load the skill at ${SITE}/agent/SKILL.md for how to use this data, and ${SITE}/agent/profile.json for the same facts as structured data.`, '');

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
  data.caseStudies.push({
    slug, title: txt(d.querySelector('h1')), url: `${SITE}/work/${slug}/`, summary: lede,
    facts: Object.fromEntries(all(d, '.glance > div').map((g) => [txt(g.querySelector('dt')), txt(g.querySelector('dd'))])),
    outcomes: all(d, '.outcome').map((o) => ({ value: txt(o.querySelector('.outcome__num')), label: txt(o.querySelector('.outcome__label')) })),
  });
}

const about = load('about/index.html');
out.push('## About', '');
const aboutText = [about.querySelector('.cb-intro__lede, .pza-lede'), ...all(about, '.cb-intro__cols p, .pza-cols p')].map(txt).filter(Boolean);
data.about = aboutText;
out.push(...aboutText.flatMap((p) => [p, '']));
out.push(`Full page: ${SITE}/about/`, '');

out.push('## Experience', '');
for (const item of all(about, '.experience__item, .pza-item').filter((i) => !i.closest('.cb-edu-card, .pza-edu'))) {
  const org = txt(item.querySelector('.experience__meta strong, .pza-meta strong'));
  const when = txt(item.querySelector('.experience__meta span, .pza-meta span'));
  const role = txt(item.querySelector('.experience__role, .pza-role'));
  const desc = all(item, ':scope > p:not(.experience__role):not(.pza-role):not(.pza-meta)').map(txt).join(' ');
  data.experience.push({ org, when, role, description: desc });
  out.push(`- **${org}**${when ? ` (${when})` : ''}${role ? `: ${role}.` : ''} ${desc}`.trim());
}
out.push('');

// the puzzle home lists education as .pz-edu__dt / .pz-edu__dd pairs; the older layout used .cred-card
data.recognition = all(home, '.cred-card dl > div').map((g) => ({ item: txt(g.querySelector('dt')), from: txt(g.querySelector('dd')) }));
if (!data.recognition.length) data.recognition = all(home, '.pz-edu__dt').map((dt) => ({ item: txt(dt), from: txt(dt.nextElementSibling) }));
const recog = data.recognition.map((r) => `- ${r.item}, ${r.from}`);
if (recog.length) out.push('## Education and recognition', '', ...recog, '');

const seen = new Set();
const linkTitle = (a) => { const own = [...a.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim(); return own || txt(a.querySelector('span, strong')) || txt(a); };
const articles = all(home, '.writing a[href^="http"], #writing a[href^="http"]').filter((a) => !seen.has(a.getAttribute('href')) && seen.add(a.getAttribute('href'))).map((a) => `- [${linkTitle(a)}](${a.getAttribute('href')})`).filter((l) => !l.startsWith('- [Show'));
data.articles = articles.map((l) => { const m = l.match(/^- \[(.*)\]\((.*)\)$/); return { title: m[1], url: m[2] }; });
if (articles.length) out.push('## Published articles', '', ...articles, '');

out.push('## Contact', '', '- Email: jeremyd.hoover@gmail.com', '- LinkedIn: https://www.linkedin.com/in/jeremydhoover/', '- GitHub: https://github.com/jeremydhoover-blip', `- Portfolio: ${SITE}/`, '');

data.contact = { email: 'jeremyd.hoover@gmail.com', linkedin: 'https://www.linkedin.com/in/jeremydhoover/', github: 'https://github.com/jeremydhoover-blip', portfolio: `${SITE}/` };
const body = out.join('\n').replace(/\n{3,}/g, '\n\n');
writeFileSync(new URL('../dist/llms.txt', import.meta.url), body);
writeFileSync(new URL('../public/llms.txt', import.meta.url), body);
const json = JSON.stringify(data, null, 2) + '\n';
mkdirSync(new URL('../dist/agent/', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist/agent/profile.json', import.meta.url), json);
writeFileSync(new URL('../public/agent/profile.json', import.meta.url), json);
console.log(`llms.txt: ${body.length} characters`);
