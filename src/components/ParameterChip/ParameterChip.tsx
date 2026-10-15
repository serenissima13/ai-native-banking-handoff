import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Icon } from '../Icon'
import './ParameterChip.css'

/**
 * ParameterChip — a parameter the assistant extracted from the person's request, editable in place.
 *
 * Figma: 04 Components › Chip / ParameterChip (component set 31:123, 21 variants).
 * Figma property → code prop
 *   Value (text)              → value
 *   Placeholder (text)        → placeholder           (shown when state="missing")
 *   Show leading icon (bool)  → icon present / absent
 *   Leading icon (swap)       → icon                  (<Icon name="amount" | "date" | "category" | "account" />)
 *   State (variant)           → state
 *   Interaction=Default       → (rest)
 *   Interaction=Pressed       → CSS :active           (runtime, not a prop)
 *   Interaction=Focused       → CSS :focus-visible    (runtime, not a prop)
 *   Interaction=Open          → open
 *   Interaction=Editing       → editing
 * Code-only: parameter (accessible name), onPress, onConfirm, onCancel, inputMode.
 */

export type ParameterChipState = 'confirmed' | 'assumed' | 'missing' | 'output' | 'edited'

export interface ParameterChipProps {
  /** What the parameter is, for screen readers: "Amount", "Deadline", "From account". */
  parameter: string
  /** The value as shown, already formatted: "€3,000", "1 Jul 2027". */
  value?: string
  /** Text shown when the value is missing. Figma default: "Choose…". */
  placeholder?: string
  /**
   * Where the value came from.
   * confirmed — the person said it · assumed — the assistant inferred it (dashed edge + "assumed" tag)
   * missing — required and absent (blocks the next step) · output — the assistant will calculate it (not interactive)
   * edited — the person changed it ("edited" tag)
   */
  state?: ParameterChipState
  /** Leading icon. Omit it to hide the icon (Figma: Show leading icon = false). Ignored for state="output". */
  icon?: ReactNode
  /** A menu is open, anchored below the chip (dates, accounts). The chevron flips. */
  open?: boolean
  /** The chip has become the field: numeric keypad, ✕ clears, ✓ confirms. */
  editing?: boolean
  /** Tap on the chip (opens the menu or starts editing — the parent decides). */
  onPress?: () => void
  /** ✓ or Enter while editing. The parent usually moves the chip to state="edited". */
  onConfirm?: (value: string) => void
  /** Escape while editing: leave without changes. */
  onCancel?: () => void
  /** Keyboard while editing. Amounts use "decimal" (Figma: Keyboard / Decimal pad). */
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

export function ParameterChip({
  parameter,
  value = '',
  placeholder = 'Choose…',
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
      <span className={classes} data-state="output" aria-label={accessibleName(parameter, value, state)}>
        <Icon name="sparkle" className="pchip__icon" />
        <span className="pchip__value text-label-md" aria-hidden="true">{value}</span>
      </span>
    )
  }

  if (editing) {
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
  const trailing = state === 'assumed' || state === 'missing' || open ? 'chevron-down' : 'edit'

  return (
    <button
      type="button"
      className={classes}
      data-state={state}
      data-open={open || undefined}
      aria-label={accessibleName(parameter, value, state)}
      aria-haspopup={trailing === 'chevron-down' ? 'menu' : undefined}
      aria-expanded={trailing === 'chevron-down' ? open : undefined}
      onClick={onPress}
    >
      {icon && <span className="pchip__icon" aria-hidden="true">{icon}</span>}
      <span className="pchip__value text-label-md" aria-hidden="true">
        {state === 'missing' ? placeholder : value}
      </span>
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
