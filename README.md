# Jeremy Hoover portfolio

Career portfolio for Jeremy Hoover, focused on product strategy, design systems, and AI workflows. Built with Astro and deployed to GitHub Pages.

## Site structure

- Homepage with career positioning, four selected projects, experience, the Technical Content Designer Program, Hoover Content System, published articles, education, recognition, and contact details
- Four case studies covering the AI design automation repo, hackathon PM agent, design-org AI initiatives, and Fabric CLI AI skills
- About page with full career and education context
- Repository guidance and quality expectations in `.github/copilot-instructions.md`

## Local development

Install dependencies with `npm install`, then start the managed background server with `npm run dev`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro server in background mode |
| `npm run dev:status` | Check the background server |
| `npm run dev:logs` | Read server logs |
| `npm run dev:stop` | Stop the background server |
| `npm run build` | Generate the production site in `dist/` |

The local site is available at `http://localhost:4321/portfolio/`.

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages. Astro is configured with the `/portfolio` base path in `astro.config.mjs`.

Production URL: <https://jeremydhoover-blip.github.io/portfolio/>

## Quality checks

Before deployment:

1. Review the homepage, About page, and all four case studies at desktop and mobile widths.
2. Confirm there is no horizontal overflow and all navigation paths work under `/portfolio`.
3. Run the Astro accessibility audit and verify keyboard focus behavior.
4. Check project facts, adoption figures, and article attribution against verified source material.
5. Run `npm run build` and confirm all expected routes generate.
