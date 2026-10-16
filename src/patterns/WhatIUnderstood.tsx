import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ParameterChip, type ParameterChipState } from '@/components/ParameterChip'
import { Icon } from '@/components/Icon'
import './WhatIUnderstood.css'

/**
 * "What I understood" — the moment the ParameterChip was designed for.
 * Mirrors Figma 05 Screens › 02 Understanding (State B), node 253:361: the person's message, the assistant's
 * reading of it as an UnderstandingCard, and the parameters as chips the person can correct in place.
 *
 * Only ParameterChip and Icon are design-system components in code. The rest of the card (message, log line,
 * month-flow bar, note, footnote, button) is drawn here with the Semantic tokens its Figma component tokens
 * alias — e.g. understanding-card/bg → --color-glass-fill-regular, month-flow/left → --color-data-series-1.
 */

const deadlines = [
  { date: '1 Jun 2027', month: 'June', months: 8 },
  { date: '1 Jul 2027', month: 'July', months: 9 },
  { date: '1 Aug 2027', month: 'August', months: 10 },
]
const ASSUMED = '1 Jul 2027'

// The person's month, from the accounts they shared (Figma: MonthFlowBar)
const IN = 1650
const OUT = 1250
const LEFT = IN - OUT

const euro = (n: number) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const parseAmount = (text: string) => Number(text.replace(/[^\d.]/g, '')) || 0
const perMonth = (amount: number, months: number) => Math.ceil(amount / months)

/** What each chip on the screen is right now — the props it is rendered with. Used by the demo's inspector. */
export interface ChipSnapshot {
  parameter: string
  type: 'input' | 'select'
  state: ParameterChipState
  interaction: 'rest' | 'open' | 'editing'
  value: string
}

export function WhatIUnderstood({ onChange }: { onChange?: (chips: ChipSnapshot[]) => void } = {}) {
  const [amount, setAmount] = useState({ value: 3000, state: 'confirmed' as ParameterChipState, editing: false })
  const [when, setWhen] = useState({ date: ASSUMED, state: 'assumed' as ParameterChipState })
  const [menuOpen, setMenuOpen] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const [confirmed, setConfirmed] = useState(false)

  const months = deadlines.find((d) => d.date === when.date)?.months ?? 9
  const monthly = perMonth(amount.value, months)
  const whenValue = `${when.date} · ${months} months`

  useEffect(() => {
    onChange?.([
      { parameter: 'Amount', type: 'input', state: amount.state, interaction: amount.editing ? 'editing' : 'rest', value: euro(amount.value) },
      { parameter: 'When', type: 'select', state: when.state, interaction: menuOpen ? 'open' : 'rest', value: whenValue },
    ])
  }, [onChange, amount, when, menuOpen, whenValue])

  return (
    <div className="wiu">
      <p className="wiu-message wiu-message--user">
        I want to save €3,000 for a holiday next summer, but I don't know how much I can afford to save every month.
      </p>

      <LogLine>You shared Current account and Savings</LogLine>
      <p className="wiu-thinking">
        <Icon name="sparkle" size={16} /> Thought for 3s
      </p>
      <p className="wiu-message wiu-message--assistant">Here's what I understood.</p>

      <section className="wiu-card" aria-labelledby="wiu-title">
        <header>
          <p className="wiu-card__eyebrow">✦ What I understood · Summer holiday</p>
          <h2 id="wiu-title" className="wiu-card__title">Did I get it right?</h2>
          <p className="wiu-card__why">Tap any value to change it.</p>
        </header>

        <div className="wiu-params">
          <div className="wiu-param">
            <span className="wiu-label">Amount</span>
            <ParameterChip
              parameter="Amount"
              type="input"
              value={euro(amount.value)}
              state={amount.state}
              editing={amount.editing}
              onPress={() => setAmount({ ...amount, editing: true })}
              onCancel={() => setAmount({ ...amount, editing: false })}
              onConfirm={(text) => {
                const next = parseAmount(text) || amount.value
                const changed = next !== amount.value
                setAmount({ value: next, state: changed ? 'edited' : amount.state, editing: false })
                if (changed) setLog((l) => [...l, `You changed the amount to ${euro(next)} · ${euro(perMonth(next, months))} a month`])
              }}
            />
          </div>

          <div className="wiu-param">
            <span className="wiu-label">When</span>
            <ChipMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              title="When do you want it by?"
              options={deadlines.map((d) => ({
                key: d.date,
                label: d.date,
                meta: `${d.months} months · ~${euro(perMonth(amount.value, d.months))} a month`,
              }))}
              selected={when.date}
              onSelect={(date) => {
                const d = deadlines.find((x) => x.date === date)!
                if (date === when.date) {
                  // Choosing the assumed date again confirms it
                  setWhen({ date, state: when.state === 'assumed' ? 'confirmed' : when.state })
                } else {
                  setWhen({ date, state: 'edited' })
                  setLog((l) => [...l, `You changed the deadline to ${d.month} · ${euro(perMonth(amount.value, d.months))} a month`])
                }
                setMenuOpen(false)
              }}
            >
              <ParameterChip
                parameter="When"
                type="select"
                value={whenValue}
                state={when.state}
                open={menuOpen}
                onPress={() => setMenuOpen(!menuOpen)}
              />
            </ChipMenu>
            {when.state === 'assumed' && <p className="wiu-label">From "next summer": I took the start of July.</p>}
          </div>
        </div>

        <hr className="wiu-divider" />

        <MonthFlow />

        <p className="wiu-note" aria-live="polite">
          You'd need about {euro(monthly)} a month.
        </p>

        <p className="wiu-footnote">
          <Icon name="info" size={16} />
          <span>Based on Current account and Savings, Jul–Sep 2026. Months vary from €80 to €610 left.</span>
        </p>
        <p className="wiu-label">Credit card not included.</p>

        <button className="wiu-button" disabled={confirmed} onClick={() => {
          setConfirmed(true)
          setLog((l) => [...l, `You confirmed: ${euro(amount.value)} by ${when.date} · ${euro(monthly)} a month`])
        }}>
          {confirmed ? 'Confirmed' : 'Looks right'}
        </button>
      </section>

      <div aria-live="polite">
        {log.map((line, i) => (
          <LogLine key={i}>{line}</LogLine>
        ))}
      </div>
    </div>
  )
}

function LogLine({ children }: { children: ReactNode }) {
  return (
    <p className="wiu-log">
      <Icon name="info" size={16} />
      <span>{children}</span>
    </p>
  )
}

/** Does it fit your month? In · Out · Left (Figma: MonthFlowBar). */
function MonthFlow() {
  return (
    <figure className="wiu-flow">
      <figcaption className="wiu-flow__title">Does it fit your month?</figcaption>
      <div className="wiu-flow__bar" aria-hidden="true">
        <span className="wiu-flow__out" style={{ flexGrow: OUT }} />
        <span className="wiu-flow__left" style={{ flexGrow: LEFT }} />
      </div>
      <dl className="wiu-flow__legend">
        <div>
          <dt>In</dt>
          <dd>{euro(IN)}</dd>
        </div>
        <div>
          <dt><span className="wiu-key wiu-key--out" aria-hidden="true" />Out</dt>
          <dd>{euro(OUT)}</dd>
        </div>
        <div>
          <dt><span className="wiu-key wiu-key--left" aria-hidden="true" />Left</dt>
          <dd>~{euro(LEFT)}</dd>
        </div>
      </dl>
    </figure>
  )
}

interface ChipMenuProps {
  open: boolean
  onClose: () => void
  title: string
  options: { key: string; label: string; meta?: string }[]
  selected: string
  onSelect: (key: string) => void
  children: ReactNode
}

/** A light stand-in for the ChipMenu component: anchored below the chip, closes on Escape or a tap outside. */
function ChipMenu({ open, onClose, title, options, selected, onSelect, children }: ChipMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && onClose()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    ref.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus()
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div className="wiu-menu-anchor" ref={ref}>
      {children}
      {open && (
        <div className="wiu-menu" role="menu" aria-label={title}>
          <p className="wiu-menu__title" aria-hidden="true">{title}</p>
          {options.map((o) => (
            <button
              key={o.key}
              role="menuitemradio"
              aria-checked={o.key === selected}
              className="wiu-menu__option"
              onClick={() => onSelect(o.key)}
            >
              <span>
                <span className="wiu-menu__label">{o.label}</span>
                {o.meta && <span className="wiu-menu__meta">{o.meta}</span>}
              </span>
              {o.key === selected && <Icon name="check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
