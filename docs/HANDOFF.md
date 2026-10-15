# ParameterChip · handoff spec

**Figma:** 04 Components › Chip / ParameterChip · component set `31:123` · 21 variants
**Code:** `src/components/ParameterChip/ParameterChip.tsx` · React + TypeScript
**Code Connect:** `ParameterChip.figma.ts` (+ `Icon/icon-*.figma.ts` for the leading icon)

## What it is

A parameter the assistant extracted from the person's request, shown where it was understood and editable in place. It makes the line between *what you said* and *what I assumed* visible — the gap the benchmark found in every product reviewed.

Used in the final journey on screens 02 What I understood and 03 Plan steps, and in prototype frames P05 to P14 (P05a editing, P05b open).

## Anatomy

```
┌──────────────────────────────────────────────────────────┐
│ [leading icon]  Value   [tag]   [trailing affordance]    │   min-height 44
└──────────────────────────────────────────────────────────┘
   20 px · optional   label/md  12 px   20 px · edit or chevron-down
   padding-x 12 · gap 8 · radius full
```

Editing replaces value + tag + affordance with: input · ✕ clear (32 px) · ✓ confirm (32 px).

## Figma property → code prop

| Figma property | Type | Values | Code prop | Notes |
|---|---|---|---|---|
| Value | Text | — | `value` | Already formatted (`€3,000`, `1 Jul 2027`). |
| Placeholder | Text | default `Choose…` | `placeholder` | Shown only when `state="missing"`. |
| Show leading icon | Boolean | — | `icon` present / absent | No boolean in code: pass an icon or don't. |
| Leading icon | Instance swap | amount · date · category · account | `icon={<Icon name="…" />}` | Ignored for Output (fixed sparkle). |
| State | Variant | Confirmed · Assumed · Missing · Output · Edited | `state` | `confirmed` · `assumed` · `missing` · `output` · `edited` |
| Interaction = Default | Variant | — | — | Rest state. |
| Interaction = Pressed | Variant | — | — | CSS `:active`. Runtime, not a prop. |
| Interaction = Focused | Variant | — | — | CSS `:focus-visible`. Runtime, not a prop. |
| Interaction = Open | Variant | — | `open` | A menu is anchored below; chevron flips; `aria-expanded`. |
| Interaction = Editing | Variant | — | `editing` | The chip becomes the field. |
| — | — | — | `parameter` | Code only. Accessible name: "Amount", "Deadline"… Code Connect fills it from the leading icon. |
| — | — | — | `onPress`, `onConfirm`, `onCancel`, `inputMode` | Code only. Behaviour. |

## States and behaviour

| State | Meaning | Looks | Interactive |
|---|---|---|---|
| Confirmed | The person said it | Brand-subtle fill, edit icon | Tap → edit or open |
| Assumed | The assistant inferred it | Glass, **dashed** edge, **"assumed"** tag, chevron | Tap → open menu |
| Missing | Required and absent; blocks the next step | Glass, brand edge, placeholder, chevron | Tap → open menu |
| Output | The assistant will calculate it | AI surface, sparkle | No — a number to read, not to change |
| Edited | The person changed it | Brand-subtle fill, **"edited"** tag | Tap → edit or open |

- **Editing:** focus moves to the input with the value selected · Enter or ✓ → `onConfirm(draft)` (parent usually sets `state="edited"`) · Escape → `onCancel()` · ✕ empties the field and keeps focus.
- **Open:** the parent owns the menu (ChipMenu in Figma). Closes on Escape or a tap outside, without change.
- State never relies on colour or dashes alone: the tag word and the icon carry it too (WCAG 1.4.1).

## Accessibility

- `<button type="button">` for every interactive state; Output is a `<span>`.
- Accessible name: `"<parameter>, <value>, <state>. Tap to change."` — e.g. *"Deadline, 1 Jul 2027, assumed. Tap to change."* Missing reads *"From account, not set, required. Tap to change."*
- Menus: `aria-haspopup="menu"` and `aria-expanded` on Assumed, Missing and any open chip.
- Focus ring: 2 px offset + 2 px ring from `--parameter-chip-focus-ring*` (WCAG 2.4.7). Same ring shown while Open and Editing.
- Touch target: min-height 44 px. Clear and confirm while editing are 32 px — above WCAG 2.5.8 (24 px), below this system's own 44 px rule.
- Numbers use tabular figures; `prefers-reduced-motion` turns transitions off.
- Chrome draws the Missing border's 1.5 px as 1 px (it snaps borders to whole pixels). Missing still reads as Missing: placeholder text, brand-coloured edge and icon.

## Tokens

Every value comes from the design system — Component tokens, Semantic tokens, and the Figma text and effect styles — so **Light and Dark need no extra CSS**. Derived sizes are calculated from tokens (the 32 px editing buttons are `height-min − 2 × padding-right-editing`; the focus ring is `focus/ring-gap` + `focus/ring-width`). The only code-only values are motion durations (the system has no motion tokens yet) and tabular figures (not readable from a Figma text style).

**Pipeline:** `scripts/figma-export/export-tokens.js` runs inside Figma and writes `tokens/figma-tokens.json`; `npm run tokens` turns it into `src/tokens/tokens.css` and `styles.css`. The CSS is generated, never edited by hand.

| Part | Token |
|---|---|
| Height · radius · padding · gap | `--parameter-chip-height-min` · `-radius` · `-padding-x` · `-gap` |
| Border width | `--parameter-chip-border-width` (1) · `-border-width-strong` (2, Open/Editing) |
| Per state: fill · edge · text | `--parameter-chip-{confirmed,assumed,missing,output,edited}-{bg,border,fg}` |
| Tags | `--parameter-chip-{assumed,edited}-tag-{bg,fg}` |
| Icons | `--parameter-chip-icon` · `-missing-icon` · `-output-icon` |
| Pressed · Open · Focus | `--parameter-chip-bg-pressed` · `-open-border` · `-focus-ring` · `-focus-ring-offset` |
| Editing | `--parameter-chip-editing-{bg,border,fg,caret,clear,confirm-bg,confirm-fg}` |
| Missing border · Editing inset | `--parameter-chip-border-width-missing` (1.5) · `--parameter-chip-padding-right-editing` (6) |
| Text | `.text-label-md` (Geist Medium 14/20) · tag `.text-caption` (Medium 12/16) |
| Glass (Assumed, Missing) | `--effect-glass-thin-blur` · `--effect-glass-thin-shadow` (Figma effect style glass/thin) |
| Focus ring | `--focus-ring-gap` + `--focus-ring-width`, colours `--parameter-chip-focus-ring(-offset)` |

## Found while handing off — and fixed

Moving the component to code surfaced six things the Figma file did not say on its own. They were fixed at the source, in Figma, and the tokens re-exported: `tokens.css` now needs no hand corrections.

| # | Finding | Resolution |
|---|---|---|
| 1 | **Code-syntax collision.** `radius/full` was both a Primitive and a Semantic token with the code syntax `--radius-full`, so in CSS the Semantic one referenced itself. | **Fixed in Figma.** Primitive renamed `radius/999` (`--radius-999`), like the other value-named primitives. |
| 2 | **Opacity units.** `opacity/40` is `40` in Figma; CSS needs `0.4`. | **By design.** Figma's layer opacity expects 0–100, so the variable stays 40. The export divides opacity by 100 — written as a rule in `tokens.css`. |
| 3 | **Token gap · Missing border.** A raw 1.5 px stroke. | **Fixed in Figma.** `border-width/1-5` → `border-width/medium` → `parameter-chip/border-width-missing`, bound on Missing (Default, Pressed, Focused). |
| 4 | **Token gap · Editing inset.** A raw 6 px right padding. | **Fixed in Figma.** `space/6` → `space/inset-nested` ((44 − 32) / 2) → `parameter-chip/padding-right-editing`, bound on the four Editing variants. |
| 5 | **Dashes.** Figma's 4/3 dash vs CSS `dashed`. | **Accepted.** Close enough; an SVG border is not worth it here. |
| 6 | **Pressed and Focused are not props.** | **By design.** Variants in Figma so they can be shown; browser states in code. Code Connect maps them to nothing. |

Two more surfaced while fixing these, and were fixed too:

- The 2 px stroke on **Open** and **Editing** was a raw value; now bound to `parameter-chip/border-width-strong` (8 variants).
- The **Output** variant's value was a fixed text ("I'll calculate"), so instances could not show the calculated amount; it is now linked to the **Value** property.

## Code Connect

`ParameterChip.figma.ts` maps every Figma property: State and Interaction exhaustively (Open → `open`, Editing → `editing`, Pressed/Focused → nothing), Value or Placeholder depending on the state, and the leading icon through the Icon templates, which also pass the parameter name used in the accessible name.

Dev Mode then shows, for an instance set to *Assumed · Default · date icon*:

```tsx
<ParameterChip
  parameter="Deadline"
  state="assumed"
  value="1 Jul 2027"
  icon={<Icon name="date" />}
/>
```

**Status:** the templates are validated with `npx figma connect parse`. Publishing to Dev Mode needs an Organization or Enterprise plan; this file is on a Professional plan, so the mapping lives here, in the repository and in the component's description in Figma (which also links to the source, this spec and the demo).
