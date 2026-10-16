# AI-native mobile banking · design-to-code handoff

The **ParameterChip** from the WIT Software design challenge, built in React + TypeScript from the Figma design system and mapped back to Figma with **Code Connect**.

> A ParameterChip is a value the assistant took from the person's own words — *said*, *assumed*, *missing*, *calculated* or *edited* — shown where it was understood and editable in place.

- **Figma file:** [AI-native mobile banking](https://www.figma.com/design/oYKI1xZAtJvaO62wPJhN8L/AI-native-mobile-banking?node-id=31-123) · page 04 Components › Chip / ParameterChip
- **Handoff spec:** [docs/HANDOFF.md](docs/HANDOFF.md)

## What is in here

| Path | What it is |
|---|---|
| `tokens/figma-tokens.json` | The design tokens as exported from Figma: variables (three tiers, Light and Dark), text styles and effect styles. |
| `src/tokens/*.css` | **Generated** from that JSON by `npm run tokens` — never edited by hand. |
| `scripts/figma-export/` | The exporter that runs inside Figma (as a development plugin, or through the Figma MCP). |
| `scripts/build-tokens.mjs` | JSON → CSS. Names from each variable's code syntax; the only rules it applies are written at the top. |
| `src/components/ParameterChip/` | The component, its CSS (tokens only) and its Code Connect template. |
| `src/components/Icon/` | The icons the chip uses, exported from Figma as SVG, with one Code Connect template per leading icon. |
| `src/App.tsx` | The live demo of **ParameterChip**: what it is, its three properties (Type · State · Interaction) and a live readout of the props of each chip on the phone. The phone shows screen 02 "What I understood" (`src/patterns/WhatIUnderstood.tsx`) only as context. Every state, specs and tests are in Storybook. |
| `figma.config.json` | Code Connect configuration. |

## Run it

Needs [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173). `npm run build` type-checks and builds to `dist/`.

## Tokens: from Figma to code

1. **Export** — in Figma desktop: *Plugins → Development → Import plugin from manifest…* → `scripts/figma-export/manifest.json` → run **Export tokens** and paste the JSON into `tokens/figma-tokens.json`. (An AI agent with the Figma MCP can run the same `exportTokens()` function.)
2. **Build** — `npm run tokens` regenerates `src/tokens/tokens.css` and `styles.css`.
3. **Ship** — commit and push; the demo redeploys.

A design change in Figma reaches the live demo without editing a line of CSS.

## Code Connect

The templates (`*.figma.ts`) tell Figma's Dev Mode which code to show for each ParameterChip instance, prop by prop.

Publishing needs a Figma **Organization or Enterprise** plan, the component published to a team library, and a personal access token with Code Connect write scope. The challenge file is on a Professional plan, so the templates are validated but not published; the same mapping is in [docs/HANDOFF.md](docs/HANDOFF.md) and in the component's description in Figma.

```bash
export FIGMA_ACCESS_TOKEN=your-token   # never commit it
npm run figma:publish
```

To check the templates without publishing: `npx figma connect parse`.

## Online

- **Demo:** https://serenissima13.github.io/ai-native-banking-handoff/
- **Storybook:** https://serenissima13.github.io/ai-native-banking-handoff/storybook/ — Foundations, the components with every variant, and the pattern in context. Each story is also a test.

`.github/workflows/deploy.yml` runs every story as a test, then publishes both to GitHub Pages on every push to `main`. A change that breaks the chip stops there. Enable it once in **Settings → Pages → Source: GitHub Actions**.

## Storybook

```bash
npm run storybook                        # http://localhost:6006
npx playwright install chromium          # once, for the tests
npx vitest --project storybook run       # every story as a test
```

Where each kind of information lives: **Figma** (page 07 Handoff) explains the design and its decisions; **Storybook** proves the code does it; **docs/HANDOFF.md** is the reference spec that links both.
