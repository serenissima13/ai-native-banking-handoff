# ParameterChip · handoff spec

**Figma:** 04 Components › Chip / ParameterChip · component set `31:123` · 33 variants
**Code:** `src/components/ParameterChip/ParameterChip.tsx` · React + TypeScript
**Code Connect:** `ParameterChip.figma.ts` (+ `Icon/icon-*.figma.ts` for the leading icon)
**Storybook:** [Components › ParameterChip](https://serenissima13.github.io/ai-native-banking-handoff/storybook/?path=/docs/components-parameterchip--docs) — every variant live, each one a test · **Figma handoff page:** [07 Handoff](https://www.figma.com/design/oYKI1xZAtJvaO62wPJhN8L/AI-native-mobile-banking?node-id=563-2)

## What it is

A parameter the assistant extracted from the person's request, shown where it was understood and editable in place. It makes the line between *what you said* and *what I assumed* visible — the gap the benchmark found in every product reviewed.

Used in the final journey on screens 02 What I understood and 03 Plan steps, and in prototype frames P05 to P14 (P05a editing, P05b open).

## Three separate questions

The chip answers three questions, and each one has its own property — in Figma and in code. They never stand in for each other.

| | Question | Figma property | Code | Values |
|---|---|---|---|---|
| **Type** | How is the value changed? | `Type` (variant) | `type` | **Input** — typed in place · **Select** — picked from a list · *Read-only* (Figma only, always with Output) |
| **State** | Where did the value come from? | `State` (variant) | `state` | Confirmed · Assumed · Missing · Edited · Output |
| **Interaction** | What is happening now? | `Interaction` (variant) | `open` · `editing` · browser states | Default · Pressed · Focused · **Open** (Select only) · **Editing** (Input only) |

- **Any State works with either Type.** An assumed amount is an Input; an assumed deadline is a Select. The variants exist for both.
- **The trailing icon shows the Type, never the State:** pencil = Input, chevron = Select.
- **Interaction is scoped by Type.** Open has no meaning for an Input, Editing none for a Select: those variants don't exist in Figma, and in code `open` is ignored on an input and `editing` on a select.
- **Output is read-only whatever else is set** — the one place where State decides the behaviour, on purpose: the assistant's own number is shown, not changed.

Which Type for which parameter, in this product:

| Parameter | Type | Why |
|---|---|---|
| Amount | Input | Any number; typed with the decimal keypad |
| Deadline | Select | A few meaningful options (months, each with its monthly cost) + "Pick a date…" |
| From account | Select | A closed list of the person's accounts |
| Category | Select | A closed list |
| Monthly saving | — (Output) | Calculated by the assistant |

## Anatomy

```
┌──────────────────────────────────────────────────────────┐
│ [leading icon]  Value   [tag]   [trailing affordance]    │   min-height 44
└──────────────────────────────────────────────────────────┘
   20 px · optional   label/md  12 px   20 px · pencil (Input) or chevron-down (Select)
   padding-x 12 · gap 8 · radius full
```

Editing (Input only) replaces value + tag + trailing icon with: input · ✕ clear (32 px) · ✓ confirm (32 px).

## Figma property → code prop

| Figma property | Type | Values | Code prop | Notes |
|---|---|---|---|---|
| Value | Text | — | `value` | Already formatted (`€3,000`, `1 Jul 2027`). |
| Placeholder | Text | default `Choose…` | `placeholder` | Shown only when `state="missing"`. |
| Show leading icon | Boolean | — | `icon` present / absent | No boolean in code: pass an icon or don't. |
| Leading icon | Instance swap | amount · date · category · account | `icon={<Icon name="…" />}` | Ignored for Output (fixed sparkle). |
| Type | Variant | Input · Select · Read-only | `type` | `"input"` (default) · `"select"`. Read-only has no prop: it is `state="output"`. |
| State | Variant | Confirmed · Assumed · Missing · Edited · Output | `state` | `confirmed` · `assumed` · `missing` · `edited` · `output` |
| Interaction = Default | Variant | any Type | — | Rest state. |
| Interaction = Pressed | Variant | any Type | — | CSS `:active`. Runtime, not a prop. |
| Interaction = Focused | Variant | any Type | — | CSS `:focus-visible`. Runtime, not a prop. |
| Interaction = Open | Variant | Select only | `open` | Menu anchored below; chevron flips; `aria-expanded="true"`. Ignored when `type="input"`. |
| Interaction = Editing | Variant | Input only | `editing` | The chip becomes the field. Ignored when `type="select"`. |
| — | — | — | `parameter` | Code only. Accessible name: "Amount", "Deadline"… Code Connect fills it from the leading icon. |
| — | — | — | `onPress` | Code only. Tap: the parent starts editing (Input) or opens its menu (Select). |
| — | — | — | `onConfirm`, `onCancel`, `inputMode` | Code only. Input only: ✓/Enter, Escape, keyboard. |

## State — where the value came from

| State | Meaning | Looks |
|---|---|---|
| Confirmed | The person said it | Brand-subtle fill |
| Assumed | The assistant inferred it — please check | Glass, **dashed** edge, amber **"assumed"** tag |
| Missing | Required and absent; blocks the next step | Glass, brand edge, placeholder |
| Edited | The person changed it | Brand-subtle fill, **"edited"** tag |
| Output | The assistant calculates it | AI surface, sparkle — read-only |

State never relies on colour or dashes alone: the tag word carries it too (WCAG 1.4.1). It does not change what a tap does — the Type does.

## Interaction — what is happening now, by Type

**Input → Editing.** Tap or Enter → the parent sets `editing`. Focus moves to the input with the value selected · Enter or ✓ → `onConfirm(draft)` (the parent usually sets `state="edited"`) · Escape → `onCancel()` · ✕ empties the field and keeps focus.

**Select → Open.** Tap or Enter → the parent opens its menu (ChipMenu in Figma) and sets `open`. The chevron flips; `aria-expanded="true"`. Choosing an option closes it (the parent usually sets `state="edited"`, or `confirmed` when the person accepts an assumption). Escape or a tap outside closes it without change.

**Any Type → Pressed, Focused.** Browser states, not props. The focus ring is the same for both Types and stays on while Open or Editing.

## Accessibility

- Input and Select are `<button type="button">`; Output is a `<span>` with a visually hidden name.
- **Select** adds `aria-haspopup="menu"` and `aria-expanded` — in every State. **Input** has no popup; Editing turns it into a labelled text field.
- Accessible name: `"<parameter>, <visible text>. Tap to change."` It contains the visible value and tag word for word, so voice-control users can say what they see (WCAG 2.5.3 Label in Name) — *"Deadline, 1 Jul 2027 assumed. Tap to change."* Missing: *"From account, Choose… Required. Tap to change."*
- Focus ring: 2 px offset + 2 px ring from `--parameter-chip-focus-ring*` (WCAG 2.4.7). Same ring shown while Open and Editing.
- Touch target: min-height 44 px. Clear and confirm while editing are 32 px visible, but their hit area is the chip's full 44 px height and reaches to the middle of the 8 px gap between them — **40 × 44**, no overlap (measured in the browser). Above WCAG 2.5.8 (24 px); the 4 px short of 44 sideways is the price of not letting the two targets overlap, and is written as such in 03 Foundations.
- Amounts use tabular figures (`display/amount`, `label/md`). `prefers-reduced-motion` turns transitions off.
- `prefers-reduced-transparency`: every glass fill becomes `color/surface/raised` and the blur goes to 0 — the usage rule from 03 Foundations, generated by the token script, not typed per component. Where a browser doesn't support the query yet, glass stays as designed (contrast on glass is already checked at its worst case).
- **Automated check:** axe-core 4.14, WCAG 2.2 A/AA, on the demo in Dark and Light × rest, open and editing — **0 violations** in all six runs. Over the project it found three, all fixed: the name not containing the visible text (Label in Name, see finding 15), and, earlier, the Output chip carried `aria-label` on a plain `<span>` (now visually hidden text), and the demo menu's secondary text fell to 4.1:1 on the selected tint in Dark. Contrast on translucent glass is reported as "needs review" (axe cannot compute it through a blur); those pairs are covered by the contrast matrix in Figma (03 Foundations).
- Chrome draws the Missing border's 1.5 px as 1 px (it snaps borders to whole pixels). Missing still reads as Missing: placeholder text, brand-coloured edge and icon.

## Tokens

Every value comes from the design system — Component tokens, Semantic tokens, and the Figma text and effect styles — so **Light and Dark need no extra CSS**. Derived sizes are calculated from tokens (the 32 px editing buttons are `height-min − 2 × padding-right-editing`; the focus ring is `focus/ring-gap` + `focus/ring-width`). The only code-only values are motion durations (the system has no motion tokens yet), tabular figures (not readable from a Figma text style) and the Reduce Transparency fallback (a media query has no Figma equivalent; it reuses existing tokens). The demo's panel and menu use the glass effect tokens too, so no blur is typed as a number anywhere.

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

A review of 03 Foundations against the code then found three promises the code did not keep. Fixed in code:

| # | Foundations said | Code did | Now |
|---|---|---|---|
| 7 | 44 px targets, "even close buttons" | Editing buttons were 32 × 32 | Hit area 40 × 44 (see Accessibility); the rule in Figma now says exactly this |
| 8 | Tabular figures for amounts | Only `label/md` had them; `display/amount` wasn't exported | `display/amount` added to the export; both styles get `tabular-nums` |
| 9 | Reduce Transparency → solid fallback | Nothing | Generated `prefers-reduced-transparency` block: glass fills → `color/surface/raised`, blur → 0 |

A review of the component's 41 variables then found four more, fixed in Figma (code was already right):

| # | Finding | Resolution |
|---|---|---|
| 10 | **No focus ring on glass chips in Figma.** Assumed and Missing (Focused, Open, Editing) carried the `glass/thin` effect style, which replaced the ring; the code showed the ring. | Ring added to the 6 variants (glass blur kept, as in code). |
| 11 | **Ring spreads were raw numbers** (2 and 4). | The inner spread is bound to `focus/ring-gap`. The outer one is gap + width, a sum Figma variables can't express — it stays 4 in Figma and is calculated in code. |
| 12 | **Confirm button had a `color/glass/stroke` edge in Figma only.** | Removed: a solid primary button needs no glass edge, and the code never had one. |
| 13 | **The "assumed" tag is amber, against the rule "anything the AI generated carries Aura".** | **By design, now written:** "assumed" asks the person to check a value — a call to confirm, not the AI's voice. The exception is in the usage rules (03 Foundations). |

Separating Type from State then surfaced three more:

| # | Finding | Resolution |
|---|---|---|
| 14 | **The State decided how the chip behaved.** Assumed and Missing always showed a chevron and announced a menu; Confirmed and Edited a pencil and no menu. An assumed *amount* announced a menu it never opened; a confirmed *deadline* opened a menu it never announced. | New **Type** property (Input · Select · Read-only) in Figma — 33 variants, Open only on Select, Editing only on Input — and `type` in code. The trailing icon and ARIA popup now follow the Type. Every instance in the file was set from its parameter (amount → Input; date, account, category → Select). |
| 15 | **Label in Name (WCAG 2.5.3).** axe 4.14 flagged that the name didn't contain the visible text ("Choose…", "1 Jul 2027 assumed"). | The name now repeats the visible value and tag word for word, then adds "Required" when missing. |
| 16 | **New variants lost their property links.** The 12 variants added with Type were copies; a copy inside a component set keeps its layers but not its links to Value, Placeholder, Show leading icon and Leading icon. An instance set to *Select · Edited* kept showing "€3,000" and the euro icon whatever it was given — found when building the in-context example on page 04. | Links restored on all 12. Checked by script on all 33 variants: every value text is linked to Value (Placeholder on Missing) and every leading icon to Show leading icon + Leading icon — except Output, whose sparkle is fixed by design. |

The Confirmed chip's edge (`color/border/subtle` on `color/surface/brand-subtle`) is 1.27:1 in Light and 1.04:1 in Dark. It is decorative — the chip is identified by its value, icon and accessible name — and is now listed with the other decorative edges in the contrast matrix.

## Code Connect

`ParameterChip.figma.ts` maps every Figma property: Type (Input → `type="input"`, Select → `type="select"`, Read-only → nothing), State and Interaction exhaustively (Open → `open`, Editing → `editing`, Pressed/Focused → nothing), Value or Placeholder depending on the state, and the leading icon through the Icon templates, which also pass the parameter name used in the accessible name.

Dev Mode then shows, for an instance set to *Select · Assumed · Default · date icon*:

```tsx
<ParameterChip
  parameter="Deadline"
  type="select"
  state="assumed"
  value="1 Jul 2027"
  icon={<Icon name="date" />}
/>
```

**Status:** the templates are validated with `npx figma connect parse`. Publishing to Dev Mode needs an Organization or Enterprise plan; this file is on a Professional plan, so the mapping lives here, in the repository and in the component's description in Figma (which also links to the source, this spec and the demo).
