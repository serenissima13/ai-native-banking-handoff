# Live iteration · rehearsal script

A design change in Figma reaching the live demo, with no CSS typed by hand. About 3 minutes; the deploy takes 1–2 more.

## The change

**"Make the assumed tag louder."** Today the *assumed* tag uses the warning surface. Change it to the AI tint, so what the assistant assumed reads as the assistant's — a plausible product question, one token, visible on screen.

## Steps

| # | Where | What to do | What to say |
|---|---|---|---|
| 1 | Figma › Variables › Component | `parameter-chip/assumed/tag-bg` → alias `color/glass/tint-ai`; `parameter-chip/assumed/tag-fg` → alias `color/ai/text` | "One decision, made where design decisions live." |
| 2 | Figma › 05 Screens | Point at screen 02: every Assumed chip already changed, Light and Dark | "The component tier carries it everywhere." |
| 3 | Figma | Run **Export tokens** (dev plugin) — or ask Claude to run `exportTokens()` through the Figma MCP | "The design system leaves Figma as data, not as screenshots." |
| 4 | VS Code | Paste into `tokens/figma-tokens.json`, then `npm run tokens` | "The CSS is generated; nobody types a hex value." |
| 5 | VS Code | `git diff src/tokens/tokens.css` — two lines changed | "The diff is the design change, nothing else." |
| 6 | VS Code | `git commit -am "Assumed tag uses the AI tint" && git push` | — |
| 7 | Browser | Open the demo after the deploy; switch Light/Dark | "Same change, both modes, in production." |
| 8 | Figma › 03 Foundations › Contrast | Find the `parameter-chip/assumed/tag-*` pair; re-check the ratio and update the card (the previews are live, the ratios are text) | "A new colour pair isn't done until it's been measured." |

## Before the presentation

- Check in advance that `color/ai/text` on `color/glass/tint-ai` + glass passes in both modes — it's already in the matrix (Glass Materials), so step 8 is a lookup, not a calculation.
- Run it once end to end, then revert (Figma: undo or set the aliases back; code: `git revert HEAD && git push`).
- Have the dev plugin imported in Figma desktop and the project open in VS Code, `npm install` done.
- Keep the demo open in a tab — GitHub Pages takes 1–2 minutes; talk through the diff while it deploys.

## If something fails

- **Plugin not imported** → step 3 through Claude + Figma MCP instead.
- **Deploy slow** → `npm run dev` and show localhost; the push still proves the pipeline.
