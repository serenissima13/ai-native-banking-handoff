import type { CSSProperties } from 'react'
import { colorRamp, semanticColorGroups, type Variable } from './tokens'

const swatchStyle: CSSProperties = {
  height: 48,
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border-subtle)',
}

const captionStyle: CSSProperties = {
  margin: 'var(--space-2xs) 0 0',
  color: 'var(--color-text-secondary)',
}

/** A Primitive colour ramp — e.g. <ColorRamp family="ink" />, every color/ink/* step. */
export function ColorRamp({ family }: { family: string }) {
  const steps = colorRamp(family)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', margin: '0 0 var(--space-lg)' }}>
      {steps.map((s) => (
        <figure key={s.css} style={{ margin: 0, width: 96 }}>
          <div style={{ ...swatchStyle, background: `var(${s.css})` }} />
          <figcaption className="text-caption" style={captionStyle}>
            <code>{s.css}</code>
            <br />
            {s.hex}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function Swatch({ v }: { v: Variable }) {
  return (
    <figure style={{ margin: 0, width: 150 }}>
      <div style={{ ...swatchStyle, height: 40, background: `var(${v.css})` }} />
      <figcaption className="text-caption" style={captionStyle}>
        <code>{v.css}</code>
      </figcaption>
    </figure>
  )
}

/** Every Semantic colour token, grouped by category (text, surface, border, interactive, feedback, ai, glass…). */
export function SemanticColorGroups() {
  const groups = semanticColorGroups()
  return (
    <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
      {groups.map(([group, vars]) => (
        <div key={group}>
          <p
            className="text-caption"
            style={{ margin: '0 0 var(--space-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-secondary)' }}
          >
            color/{group}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            {vars.map((v) => (
              <Swatch key={v.css} v={v} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
