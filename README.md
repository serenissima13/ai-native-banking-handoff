# AI-native mobile banking · design-to-code handoff

The **ParameterChip** from the WIT Software design challenge, built in React + TypeScript from the Figma design system and mapped back to Figma with **Code Connect**.

> A ParameterChip is a value the assistant took from the person's own words — *said*, *assumed*, *missing*, *calculated* or *edited* — shown where it was understood and editable in place.

- **Figma file:** [AI-native mobile banking](https://www.figma.com/design/oYKI1xZAtJvaO62wPJhN8L/AI-native-mobile-banking?node-id=31-123) · page 04 Components › Chip / ParameterChip
- **Handoff spec:** [docs/HANDOFF.md](docs/HANDOFF.md)

## What is in here

| Path | What it is |
|---|---|
| `src/tokens/tokens.css` | Design tokens exported from the Figma variables, three tiers: Primitives → Semantic (Light and Dark) → Component. Names come from each variable's code syntax in Figma. |
| `src/tokens/styles.css` | The Figma text style `label/md` and effect style `glass/thin`, written as CSS. |
| `src/components/ParameterChip/` | The component, its CSS (tokens only) and its Code Connect template. |
| `src/components/Icon/` | The icons the chip uses, exported from Figma as SVG, with one Code Connect template per leading icon. |
| `src/App.tsx` | A demo: the chip in context (the "what I understood" step) and every state, in Dark and Light. |
| `figma.config.json` | Code Connect configuration. |

## Run it

Needs [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173). `npm run build` type-checks and builds to `dist/`.

## Code Connect

The templates (`*.figma.ts`) tell Figma's Dev Mode which code to show for each ParameterChip instance, prop by prop.

Publishing needs a Figma **Organization or Enterprise** plan, the component published to a team library, and a personal access token with Code Connect write scope. The challenge file is on a Professional plan, so the templates are validated but not published; the same mapping is in [docs/HANDOFF.md](docs/HANDOFF.md) and in the component's description in Figma.

```bash
export FIGMA_ACCESS_TOKEN=your-token   # never commit it
npm run figma:publish
```

To check the templates without publishing: `npx figma connect parse`.

## Demo online

`.github/workflows/deploy.yml` publishes the demo to GitHub Pages on every push to `main`. Enable it once in **Settings → Pages → Source: GitHub Actions**.
