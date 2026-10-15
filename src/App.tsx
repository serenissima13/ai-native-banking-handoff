import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ParameterChip, type ParameterChipState } from '@/components/ParameterChip'
import { Icon } from '@/components/Icon'

type Theme = 'dark' | 'light'

const FIGMA_URL =
  'https://www.figma.com/design/oYKI1xZAtJvaO62wPJhN8L/AI-native-mobile-banking?node-id=31-123'

const deadlines = [
  { label: 'Jun 2027', months: 8 },
  { label: 'Jul 2027', months: 9 },
  { label: 'Aug 2027', months: 10 },
]
const accounts = ['Current ·· 4821', 'Savings ·· 3307']

const euro = (n: number) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const parseAmount = (text: string) => Number(text.replace(/[^\d.]/g, '')) || 0

export function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Handoff · AI-native mobile banking</p>
          <h1>ParameterChip</h1>
          <p className="lead">
            A value the assistant took from the person's own words — said, assumed, missing, calculated or edited —
            and editable where it stands.
          </p>
        </div>
        <div className="page__actions">
          <div className="segmented" role="radiogroup" aria-label="Theme">
            {(['dark', 'light'] as const).map((t) => (
              <button key={t} role="radio" aria-checked={theme === t} onClick={() => setTheme(t)}>
                {t === 'dark' ? 'Dark' : 'Light'}
              </button>
            ))}
          </div>
          <a className="link" href={FIGMA_URL} target="_blank" rel="noreferrer">
            Open in Figma ↗
          </a>
        </div>
      </header>

      <section className="panel">
        <h2>In context · what I understood</h2>
        <p className="hint">
          Tap €3,000 to edit it, the date to pick another month, and the account to choose one. The monthly amount is
          the assistant's own number: it recalculates and cannot be edited.
        </p>
        <UnderstandingDemo />
      </section>

      <section className="panel">
        <h2>Every state</h2>
        <p className="hint">Pressed and focused are live: press a chip, or move to it with Tab.</p>
        <StateMatrix />
      </section>

      <footer className="page__footer">
        Built from the Figma variables: Component → Semantic → Primitives. Switch the theme: the component has no
        theme-specific code.
      </footer>
    </div>
  )
}

/* ── In context ─────────────────────────────────────────── */
function UnderstandingDemo() {
  const [amount, setAmount] = useState({ value: '€3,000', state: 'confirmed' as ParameterChipState, editing: false })
  const [deadline, setDeadline] = useState({ value: 'Jul 2027', state: 'assumed' as ParameterChipState })
  const [account, setAccount] = useState<{ value: string; state: ParameterChipState }>({ value: '', state: 'missing' })
  const [menu, setMenu] = useState<'deadline' | 'account' | null>(null)

  const months = deadlines.find((d) => d.label === deadline.value)?.months ?? 9
  const monthly = euro(Math.ceil(parseAmount(amount.value) / months))
  const blocked = account.state === 'missing'

  return (
    <div className="understanding">
      <Row label="Save">
        <ParameterChip
          parameter="Amount"
          icon={<Icon name="amount" />}
          value={amount.value}
          state={amount.state}
          editing={amount.editing}
          onPress={() => setAmount({ ...amount, editing: true })}
          onCancel={() => setAmount({ ...amount, editing: false })}
          onConfirm={(text) => {
            const next = euro(parseAmount(text))
            setAmount({ value: next, state: next === amount.value ? amount.state : 'edited', editing: false })
          }}
        />
      </Row>

      <Row label="By">
        <MenuAnchor
          open={menu === 'deadline'}
          onClose={() => setMenu(null)}
          options={deadlines.map((d) => ({
            label: d.label,
            meta: `${euro(Math.ceil(parseAmount(amount.value) / d.months))} a month`,
          }))}
          selected={deadline.value}
          onSelect={(label) => {
            setDeadline({ value: label, state: label === 'Jul 2027' && deadline.state === 'assumed' ? 'confirmed' : 'edited' })
            setMenu(null)
          }}
        >
          <ParameterChip
            parameter="Deadline"
            icon={<Icon name="date" />}
            value={deadline.value}
            state={deadline.state}
            open={menu === 'deadline'}
            onPress={() => setMenu(menu === 'deadline' ? null : 'deadline')}
          />
        </MenuAnchor>
      </Row>

      <Row label="From">
        <MenuAnchor
          open={menu === 'account'}
          onClose={() => setMenu(null)}
          options={accounts.map((a) => ({ label: a }))}
          selected={account.value}
          onSelect={(label) => {
            setAccount({ value: label, state: 'confirmed' })
            setMenu(null)
          }}
        >
          <ParameterChip
            parameter="From account"
            icon={<Icon name="account" />}
            value={account.value}
            state={account.state}
            placeholder="Choose…"
            open={menu === 'account'}
            onPress={() => setMenu(menu === 'account' ? null : 'account')}
          />
        </MenuAnchor>
      </Row>

      <Row label="Each month">
        <ParameterChip parameter="Monthly saving" value={`≈ ${monthly}`} state="output" />
      </Row>

      <div className="understanding__footer">
        <button className="cta" disabled={blocked} aria-describedby={blocked ? 'cta-why' : undefined}>
          Find the money
        </button>
        {blocked && (
          <p id="cta-why" className="hint">
            Choose an account first.
          </p>
        )}
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="row">
      <span className="row__label">{label}</span>
      {children}
    </div>
  )
}

interface MenuAnchorProps {
  open: boolean
  onClose: () => void
  options: { label: string; meta?: string }[]
  selected: string
  onSelect: (label: string) => void
  children: ReactNode
}

/** A light stand-in for the ChipMenu component: anchored 8 px below the chip, closes on Escape or outside tap. */
function MenuAnchor({ open, onClose, options, selected, onSelect, children }: MenuAnchorProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && onClose()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    ref.current?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')?.focus()
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div className="menu-anchor" ref={ref}>
      {children}
      {open && (
        <div className="menu" role="menu">
          {options.map((o) => (
            <button
              key={o.label}
              role="menuitemradio"
              aria-checked={o.label === selected}
              className="menu__option"
              onClick={() => onSelect(o.label)}
            >
              <span>
                <span className="menu__label">{o.label}</span>
                {o.meta && <span className="menu__meta">{o.meta}</span>}
              </span>
              {o.label === selected && <Icon name="check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Every state ─────────────────────────────────────────── */
const rows: { state: ParameterChipState; label: string; value: string }[] = [
  { state: 'confirmed', label: 'Confirmed · the person said it', value: '€3,000' },
  { state: 'assumed', label: 'Assumed · the assistant inferred it', value: '1 Jul 2027' },
  { state: 'missing', label: 'Missing · required, blocks the next step', value: '' },
  { state: 'edited', label: 'Edited · the person changed it', value: '€2,800' },
  { state: 'output', label: 'Output · the assistant calculates it', value: '≈ €334' },
]

function StateMatrix() {
  return (
    <div className="matrix" role="table" aria-label="ParameterChip states">
      <div className="matrix__row matrix__head" role="row">
        <span role="columnheader">State</span>
        <span role="columnheader">Default</span>
        <span role="columnheader">Open</span>
        <span role="columnheader">Editing</span>
      </div>
      {rows.map((r) => (
        <div className="matrix__row" role="row" key={r.state}>
          <span role="rowheader" className="matrix__label">{r.label}</span>
          <span role="cell">
            <ParameterChip parameter="Example" icon={r.state === 'output' ? undefined : <Icon name="amount" />} value={r.value} state={r.state} />
          </span>
          <span role="cell">
            {r.state !== 'output' ? (
              <ParameterChip parameter="Example" icon={<Icon name="amount" />} value={r.value} state={r.state} open />
            ) : (
              <span className="na">not interactive</span>
            )}
          </span>
          <span role="cell">
            {r.state !== 'output' ? (
              <StaticEditing value={r.value} />
            ) : (
              <span className="na">not interactive</span>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

function StaticEditing({ value }: { value: string }) {
  const [editing, setEditing] = useState(false)
  return editing ? (
    <ParameterChip parameter="Example" icon={<Icon name="amount" />} value={value} editing onConfirm={() => setEditing(false)} onCancel={() => setEditing(false)} />
  ) : (
    <button className="ghost" onClick={() => setEditing(true)}>
      Show editing
    </button>
  )
}
