import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Icon } from '../Icon'
import './ParameterChip.css'

/**
 * ParameterChip — a parameter the assistant extracted from the person's request, editable in place.
 *
 * Figma: 04 Components › Chip / ParameterChip (component set 31:123, 33 variants).
 *
 * Three independent questions:
 *   type        — how the value is changed:  input (typed in place) · select (picked from a list)
 *   state       — where the value came from: confirmed · assumed · missing · edited · output
 *   interaction — what is happening now:     rest · pressed · focused (browser states)
 *                                             open (select only) · editing (input only)
 * Any state works with either type. The trailing icon shows the type (pencil = input, chevron = select),
 * never the state. state="output" is always read-only: type, open and editing are ignored.
 *
 * Figma property → code prop
 *   Type=Input | Select       → type="input" | "select"   (Type=Read-only ↔ state="output")
 *   State (variant)           → state
 *   Interaction=Default       → (rest)
 *   Interaction=Pressed       → CSS :active           (runtime, not a prop)
 *   Interaction=Focused       → CSS :focus-visible    (runtime, not a prop)
 *   Interaction=Open          → open                  (type="select" only)
 *   Interaction=Editing       → editing               (type="input" only)
 *   Value (text)              → value
 *   Placeholder (text)        → placeholder           (shown when state="missing")
 *   Show leading icon (bool)  → icon present / absent
 *   Leading icon (swap)       → icon                  (<Icon name="amount" | "date" | "category" | "account" />)
 * Code-only: parameter (accessible name), onPress, onConfirm, onCancel, inputMode.
 */

/** How the value is changed. */
export type ParameterChipType = 'input' | 'select'

/** Where the value came from. */
export type ParameterChipState = 'confirmed' | 'assumed' | 'missing' | 'output' | 'edited'

export interface ParameterChipProps {
  /** What the parameter is, for screen readers: "Amount", "Deadline", "From account". */
  parameter: string
  /** The value as shown, already formatted: "€3,000", "1 Jul 2027". */
  value?: string
  /** Text shown when the value is missing. Figma default: "Choose…". */
  placeholder?: string
  /**
   * TYPE — how the value is changed.
   * input — typed in place (Amount): tap → editing · select — picked from a list (Deadline, Account): tap → open.
   * Decides the trailing icon (pencil / chevron) and the ARIA popup. Ignored for state="output".
   */
  type?: ParameterChipType
  /**
   * STATE — where the value came from.
   * confirmed — the person said it · assumed — the assistant inferred it (dashed edge + "assumed" tag)
   * missing — required and absent (blocks the next step) · edited — the person changed it ("edited" tag)
   * output — the assistant calculates it (read-only, whatever the type)
   */
  state?: ParameterChipState
  /** Leading icon. Omit it to hide the icon (Figma: Show leading icon = false). Ignored for state="output". */
  icon?: ReactNode
  /** INTERACTION · type="select" only: the menu is open, anchored below the chip. The chevron flips. */
  open?: boolean
  /** INTERACTION · type="input" only: the chip has become the field — keypad, ✕ clears, ✓ confirms. */
  editing?: boolean
  /** Tap on the chip. The parent starts editing (input) or opens its menu (select). */
  onPress?: () => void
  /** Input · ✓ or Enter while editing. The parent usually moves the chip to state="edited". */
  onConfirm?: (value: string) => void
  /** Input · Escape while editing: leave without changes. */
  onCancel?: () => void
  /** Input · keyboard while editing. Amounts use "decimal" (Figma: Keyboard / Decimal pad). */
  inputMode?: 'decimal' | 'text'
  className?: string
}

const tagText: Partial<Record<ParameterChipState, string>> = {
  assumed: 'assumed',
  edited: 'edited',
}

const stateSpoken: Record<ParameterChipState, string> = {
  confirmed: '',
  assumed: 'assumed',
  missing: 'not set, required',
  output: 'calculated by the assistant',
  edited: 'edited',
}

function accessibleName(parameter: string, value: string | undefined, state: ParameterChipState) {
  const parts = [parameter, state === 'missing' ? undefined : value, stateSpoken[state]].filter(Boolean)
  const sentence = parts.join(', ')
  return state === 'output' ? `${sentence}.` : `${sentence}. Tap to change.`
}

/**
 * Name for the interactive chip. It contains the visible text word for word — value (or placeholder) and tag —
 * so voice-control users can say what they see ("click 1 Jul 2027 assumed") · WCAG 2.5.3 Label in Name.
 */
function buttonName(parameter: string, visible: string, state: ParameterChipState) {
  const end = /[.…]$/.test(visible) ? '' : '.'
  return state === 'missing'
    ? `${parameter}, ${visible}${end} Required. Tap to change.`
    : `${parameter}, ${visible}${end} Tap to change.`
}

export function ParameterChip({
  parameter,
  value = '',
  placeholder = 'Choose…',
  type = 'input',
  state = 'confirmed',
  icon,
  open = false,
  editing = false,
  onPress,
  onConfirm,
  onCancel,
  inputMode = 'decimal',
  className,
}: ParameterChipProps) {
  const classes = ['pchip', className].filter(Boolean).join(' ')

  // Output: the assistant's own number — shown, never edited.
  if (state === 'output') {
    return (
      <span className={classes} data-state="output">
        <Icon name="sparkle" className="pchip__icon" />
        <span className="pchip__value text-label-md" aria-hidden="true">{value}</span>
        {/* A plain span cannot carry aria-label (axe: aria-prohibited-attr), so the name is visually hidden text */}
        <span className="pchip__sr-only">{accessibleName(parameter, value, state)}</span>
      </span>
    )
  }

  // Interaction is scoped by type: only an input can be edited, only a select can be open.
  const isEditing = type === 'input' && editing
  const isOpen = type === 'select' && open

  if (isEditing) {
    return (
      <EditingChip
        className={classes}
        parameter={parameter}
        value={value}
        icon={icon}
        inputMode={inputMode}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )
  }

  const tag = tagText[state]
  const shown = state === 'missing' ? placeholder : value
  // The trailing icon tells how the value changes (type), never where it came from (state).
  const trailing = type === 'select' ? 'chevron-down' : 'edit'

  return (
    <button
      type="button"
      className={classes}
      data-type={type}
      data-state={state}
      data-open={isOpen || undefined}
      aria-label={buttonName(parameter, tag ? `${shown} ${tag}` : shown, state)}
      aria-haspopup={type === 'select' ? 'menu' : undefined}
      aria-expanded={type === 'select' ? isOpen : undefined}
      onClick={onPress}
    >
      {icon && <span className="pchip__icon" aria-hidden="true">{icon}</span>}
      <span className="pchip__value text-label-md" aria-hidden="true">
        {shown}
      </span>
      {/* A space between value and tag, so the visible text reads "1 Jul 2027 assumed" like the name.
          Whitespace-only text in a flex container takes no room: the gap token still sets the spacing. */}
      {tag && ' '}
      {tag && (
        <span className="pchip__tag text-caption" aria-hidden="true">
          {tag}
        </span>
      )}
      <Icon name={trailing} className="pchip__affordance" />
    </button>
  )
}

interface EditingChipProps {
  className: string
  parameter: string
  value: string
  icon?: ReactNode
  inputMode: 'decimal' | 'text'
  onConfirm?: (value: string) => void
  onCancel?: () => void
}

function EditingChip({ className, parameter, value, icon, inputMode, onConfirm, onCancel }: EditingChipProps) {
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') onConfirm?.(draft)
    if (event.key === 'Escape') onCancel?.()
  }

  return (
    <span className={className} data-editing="true" role="group" aria-labelledby={id}>
      <span id={id} className="pchip__sr-only">
        Editing {parameter}
      </span>
      {icon && <span className="pchip__icon" aria-hidden="true">{icon}</span>}
      <input
        ref={inputRef}
        className="pchip__input text-label-md"
        value={draft}
        inputMode={inputMode}
        aria-label={parameter}
        size={Math.max(draft.length, 4)}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <button
        type="button"
        className="pchip__clear"
        aria-label={`Clear ${parameter}`}
        onClick={() => {
          setDraft('')
          inputRef.current?.focus()
        }}
      >
        <Icon name="x" size={16} />
      </button>
      <button type="button" className="pchip__confirm" aria-label={`Confirm ${parameter}`} onClick={() => onConfirm?.(draft)}>
        <Icon name="check" size={16} />
      </button>
    </span>
  )
}
