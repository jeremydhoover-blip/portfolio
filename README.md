# Jeremy Hoover portfolio

Career portfolio for Jeremy Hoover, focused on product strategy, design systems, and AI workflows. Built with Astro and deployed to GitHub Pages.

**[View the live portfolio](https://jeremydhoover-blip.github.io/portfolio/)**

## About the portfolio

I built this site to show how I connect design, product, and engineering through systems that people can use. It includes four detailed case studies, my recent experience, the Technical Content Designer Program, independent open-source work, published articles, and professional recognition.

### Selected work

- **AI design automation:** The repository that became the primary prototyping and design tool for a 30-person Microsoft team
- **Hackathon agent:** An agentic product experience that won Best Use of AI and expanded across the organization
- **Design-org AI infrastructure:** Agent adoption, shared knowledge, AI education, and leadership demonstrations across a 150+ person design organization
- **Fabric CLI AI skills:** Public AI agent infrastructure shipped in the Microsoft Fabric CLI
- **Hoover Content System:** An independent, open-source content system for developer products

## Built with

- [Astro](https://astro.build/)
- HTML and CSS
- GitHub Actions
- GitHub Pages

The site is static, responsive, and designed to work under the `/portfolio` base path.

## Run locally

Requires Node.js 22.12 or later and Python 3.12.

```sh
npm install
npm run dev
```

Open [http://localhost:4321/portfolio/](http://localhost:4321/portfolio/).

Build and audit the production site with:

```sh
npm run quality
```

## Deployment

Pushes to `main` deploy automatically to GitHub Pages through the workflow in `.github/workflows/deploy.yml`.
