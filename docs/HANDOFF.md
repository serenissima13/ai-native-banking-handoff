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

## Tokens

Every value comes from a Component token, which resolves through Semantic tokens, so **Light and Dark need no extra CSS**.

| Part | Token |
|---|---|
| Height · radius · padding · gap | `--parameter-chip-height-min` · `-radius` · `-padding-x` · `-gap` |
| Border width | `--parameter-chip-border-width` (1) · `-border-width-strong` (2, Open/Editing) |
| Per state: fill · edge · text | `--parameter-chip-{confirmed,assumed,missing,output,edited}-{bg,border,fg}` |
| Tags | `--parameter-chip-{assumed,edited}-tag-{bg,fg}` |
| Icons | `--parameter-chip-icon` · `-missing-icon` · `-output-icon` |
| Pressed · Open · Focus | `--parameter-chip-bg-pressed` · `-open-border` · `-focus-ring` · `-focus-ring-offset` |
| Editing | `--parameter-chip-editing-{bg,border,fg,caret,clear,confirm-bg,confirm-fg}` |
| Text | `label/md` → Geist Medium 14/20 |
| Glass (Assumed, Missing) | `glass/thin` → blur 12 · inner highlight · drop shadow 0 4 16 |

## Found while handing off

Moving the component to code surfaced six things the Figma file does not say on its own:

1. **Code-syntax collision.** `radius/full` exists as a Primitive and a Semantic token with the same code syntax `--radius-full`, so in CSS the Semantic one would reference itself. Exported the Primitive as `--radius-999`. *Fix in Figma: give the Primitive its own code syntax.*
2. **Opacity in percent.** `opacity/40` is stored as `40`; CSS needs `0.4`. *Fix in Figma: store opacities as 0–1, or note the unit in the code syntax.*
3. **Token gap · Missing border.** Figma uses a raw 1.5 stroke, between `border-width/1` and `/2`. Kept as `1.5px`, marked `TOKEN-GAP`.
4. **Token gap · Editing padding.** A raw 6 on the right while editing. Kept as `6px`, marked `TOKEN-GAP`.
5. **Dashes.** Figma's dash pattern is 4/3; CSS `dashed` is close but browser-defined. Exact dashes would need an SVG border — not worth it for this component.
6. **Pressed and Focused are not props.** In Figma they are variants so they can be shown; in code they are browser states (`:active`, `:focus-visible`). The Code Connect template maps them to nothing on purpose.

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

Publishing: see the README. Needs an Organization or Enterprise plan and the component published to a library.
