<div align="center">

# Kiro Use Case Showcase

**A sales & showcase website for Kiro** — presenting Use Cases, a real-world system example, hands-on labs, and pricing, styled after [kiro.dev](https://kiro.dev/) with a combined **Kiro × AWS × Com7** theme.

![Status](https://img.shields.io/badge/status-live-7c5cff)
![License](https://img.shields.io/badge/license-MIT-00a94f)
![Tech](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-ff9900)
![No Build](https://img.shields.io/badge/build-none-7c5cff)
![Built with Kiro](https://img.shields.io/badge/built%20with-Kiro-8a63ff)

</div>

---

> **Kiro** is an agentic IDE from AWS, powered by Anthropic's Claude via Amazon Bedrock. It champions **Spec-Driven Development** — the spec is the source of truth, and code is just a build artifact.

This project is a single-page marketing site that explains what Kiro does, shows a production system built with it (33 Use Cases), and offers 7 interactive hands-on labs — all in a clean, dark, kiro.dev-inspired design.

---

## Features

- **Zero-dependency static site** — pure HTML + CSS + JS. No framework, no build step, no `node_modules`.
- **Use Case documentation** — 10 Kiro Use Cases + 33 real-system Use Cases, each with full flows and EARS requirements, viewable in modals.
- **Interactive IDE mockup** — a hand-crafted Kiro IDE preview with a 3D reveal animation on scroll.
- **7 hands-on labs** — step-by-step guides (Spec → Design → Tasks → Code → Steering → Hook) with copy-ready prompts.
- **Working demo app** — a fully functional Pomodoro Timer in `preview/` as the expected lab output.
- **kiro.dev-style design** — flat black + Kiro violet, Poppins headings, SVG line-icon system, responsive, with reveal/count-up/hover animations and `prefers-reduced-motion` support.
- **SEO-ready** — Open Graph & Twitter meta, theme-color, and clean URLs for deployment.

---

## Demo

| Page | Path | Description |
|------|------|-------------|
| Home | `index.html` | 15-section landing page |
| Labs | `lab.html` | Hands-on lab catalog (router) |
| Lab detail | `lab.html?lab=pomodoro` | Individual lab walkthrough |
| Pomodoro demo | `preview/index.html` | Working example app |

> Run a local server (below) and open `http://localhost:5500` to view all pages with working internal links.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (custom properties, grid, flexbox) |
| Logic | Vanilla JavaScript (ES5-compatible, no framework) |
| Fonts | Poppins, IBM Plex Sans Thai, JetBrains Mono (Google Fonts) |
| Icons | Inline SVG line-icon system (`icons.js`) |
| Hosting | Vercel (static) — portable to Netlify / GitHub Pages / S3 |

---

## Getting Started

### Prerequisites

None to view the site — any modern browser works. For local serving you only need **Python** or **Node.js** (either one).

### Installation

```bash
git clone https://github.com/wave03F/USE_CASE_KIRO.git
cd USE_CASE_KIRO
```

### Run locally

Open `index.html` directly, **or** serve it (recommended so internal links resolve):

```bash
# Option A — Python
python -m http.server 5500

# Option B — Node
npx serve .
```

Then visit `http://localhost:5500`.

### Configuration

No environment variables or config required. Deployment behavior is controlled by:

- `vercel.json` — enables `cleanUrls`
- `.vercelignore` — keeps internal files (`USE_CASES.md`, archives) out of the deployed build

---

## Usage

### Edit content

| To change… | Edit this file |
|------------|----------------|
| Kiro's 10 Use Cases / 7 Actors | `data.js` |
| Real-system 33 Use Cases | `showcase-data.js` |
| Labs (add/edit) | `lab-data.js` |
| Theme colors | `:root` variables in `styles.css` |

### Add a new lab

Add an entry to `LABS` in `lab-data.js`, then add its key to `LAB_ORDER`. It appears in the catalog automatically.

```js
const LABS = {
  mylab: {
    icon: "spec", level: "เริ่มต้น", tag: "เว็บแอป", time: "30 นาที",
    title: "My Lab", tagline: "...", intro: "...", preview: null,
    steps: [ /* 6 steps: Spec, Design, Tasks, Code, Steering, Hook */ ],
    bonus: [ /* extra challenges */ ]
  }
};
const LAB_ORDER = ["pomodoro", "todo", /* ... */, "mylab"];
```

### Add an icon

Add an SVG path to `icons.js`, then use it via `icon("name")` in JS or `data-icon="name"` in HTML.

---

## Project Structure

```
USE_CASE_KIRO/
├── index.html          # Landing page (15 sections)
├── styles.css          # Global styles (kiro.dev theme)
├── app.js              # Landing page render + interactions
├── data.js             # 7 Actors + 10 Kiro Use Cases
├── showcase-data.js    # 33 real-system Use Cases (Landed-Cost Engine)
├── showcase.js         # Showcase section renderer
├── icons.js            # 23 inline SVG line icons
│
├── lab.html            # Hands-on Lab (single-page router)
├── lab-data.js         # 7 labs' content
├── lab.js              # Lab router + catalog/detail renderer
├── lab.css             # Lab-specific styles
│
├── logo.svg            # Kiro ghost logo (also favicon)
│
├── preview/            # Working Pomodoro Timer demo
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── USE_CASES.md        # Source spec for the 33 Use Cases
├── vercel.json         # Deploy config (cleanUrls)
├── .vercelignore       # Excludes internal files from deploy
├── LICENSE             # MIT
└── README.md
```

### Content overview

- **10 Kiro Use Cases** (`data.js`) — based on real Kiro features: Spec-Driven Development, Agent Hooks, MCP, Steering, Autopilot/Supervised modes, and approval guardrails.
- **33 real-system Use Cases** (`showcase-data.js`) — extracted from `USE_CASES.md`, the *Cross-Border Trade Compliance & Landed-Cost Engine* across 9 modules (Auth, Calculation, HTS, Tariff Rules & Exclusions, FX, Audit, Favorites, Export, User Management). Each includes Actor, preconditions, main/alternative/exception flows, postconditions, business rules, and an EARS requirement.

---

## Deployment

Static site — deploy anywhere. For Vercel:

```bash
npx vercel --prod
```

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-change`
3. Keep the style consistent — vanilla JS, existing CSS variables, and the SVG icon system (no emoji in UI)
4. Test by serving locally and checking every page renders without console errors
5. Commit with a clear message and open a Pull Request

**Guidelines**

- No build tools or runtime dependencies — keep it pure static.
- Reuse `icon("name")` / `data-icon` instead of inline emoji.
- Add new data (use cases, labs) to the `*-data.js` files rather than hard-coding in HTML.
- Match the kiro.dev-inspired dark/violet theme.

---

## License

Released under the [MIT License](./LICENSE).

---

## Contact & Credits

- **Repository:** [github.com/wave03F/USE_CASE_KIRO](https://github.com/wave03F/USE_CASE_KIRO)
- **Enterprise inquiries (AWS × Com7 Business):**
  - Email: `cloudservice@comseven.com`
  - Phone: 02-017-7777 (ext. 7677)

<div align="center">

Built with **Kiro** · Spec-Driven Development · Theme **Kiro × AWS × Com7**

</div>
