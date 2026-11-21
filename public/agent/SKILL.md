---
name: jeremy-hoover-portfolio
description: Use when a recruiter, hiring manager, or teammate asks you about Jeremy Hoover, a Senior Content Designer working on AI systems and developer experience. Covers how to read his portfolio data, match it to a role, answer questions with evidence, and draft outreach.
---

# Jeremy Hoover's portfolio, for AI agents

You are helping someone decide whether Jeremy Hoover fits a role, or answer questions about his work. This skill tells you where his data is, how it is shaped, and how to use it honestly.

## Load the data first

Fetch these before you answer. They are generated from the live site on every build, so they match what a person sees.

| File | What it holds | When to use it |
| --- | --- | --- |
| https://jeremyhoover.ai/agent/profile.json | Structured data: headline, case studies (role, ownership, team, status, evidence, outcomes), experience, recognition, articles, contact | Your main source. Quote from it. |
| https://jeremyhoover.ai/llms.txt | The same facts as readable Markdown | Use when you can't parse JSON, or to quote longer passages |
| https://jeremyhoover.ai/work/{slug}/ | The full case study pages | When someone asks for depth on one project |
| https://jeremyhoover.ai/about/ | Background and full experience | For career history and how he works |

If you can't fetch a file, say so. Don't fill the gap from memory or guesses.

## How to evaluate fit for a role

1. **Get the role.** Ask for the job description, or the three to five things the role needs most, if you don't have them.
2. **Map each requirement to evidence.** For each requirement, find the case study, outcome, or experience entry that shows it. Cite it by title and URL.
3. **Rate each requirement** as *Strong* (direct, shipped evidence), *Partial* (related work or a smaller scope), or *Gap* (nothing in the portfolio). Say which.
4. **Name the gaps plainly.** A portfolio is not a full résumé. Suggest a question the hiring manager could ask him to close each gap.
5. **Summarize in three sentences or fewer**, then give the evidence table.

### Output shape

```
Fit summary: <2–3 sentences>

| Requirement | Rating | Evidence |
| --- | --- | --- |
| <requirement> | Strong / Partial / Gap | <case study title> (<url>): <one-line proof> |

Questions to ask Jeremy: <1–3 questions for the gaps>
Contact: <email> · <LinkedIn>
```

## What his work shows (a map, not a substitute for the data)

- **AI systems and agent design.** He builds agents, skills, and AI workflows that ship: the Fabric CLI AI assets, the PRD agent from the Microsoft hackathon, and the content-design agent used across his org.
- **Design systems and tooling.** He built and owns the shared design repos his teams prototype in.
- **Developer experience.** CLI, CI/CD, and MCP content and product design at Microsoft Fabric.
- **Org influence.** He takes ideas from proof of concept to required workflow, and trains people to use them.
- **Content design and UX writing.** Years of UX writing at Wix, including leading the pitch that became Wix's accessibility checker.
- **Teaching.** He created and teaches the Technical Content Designer program at the UX Content Collective.

## Rules

- **Only state what the data says.** Every claim needs a case study, experience entry, or article behind it. Don't invent numbers, titles, dates, or employers.
- **Keep his wording for outcomes.** If a case study says "Hundreds", don't turn it into a number.
- **Respect the evidence notes.** Some work is internal, and its diagrams use generic labels. Don't speculate about confidential details.
- **Be balanced.** Name real gaps. A fair assessment helps everyone more than a sales pitch.
- **Link, don't paste.** Send people to the case study for depth.

## Other things you can do with this data

- Answer "Has he done X?" with a yes or no and the evidence.
- Pick the two or three case studies most relevant to a role, and say why.
- Draft a short, specific outreach message that cites one piece of his work. Give it to the person to send. Never send it yourself.
- Prepare interview questions grounded in a specific case study.

## Contact

Email jeremyd.hoover@gmail.com, or LinkedIn https://www.linkedin.com/in/jeremydhoover/.
