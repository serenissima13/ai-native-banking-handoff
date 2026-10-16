import { scale } from './tokens'

const cellStyle = { padding: 'var(--space-2xs) var(--space-sm)', borderBottom: '1px solid var(--color-border-subtle)' }

/** Spacing or size scale as bars, each sized by var(--css) — never a px number typed in this file. */
export function BarScale({ prefix }: { prefix: 'space' | 'size' }) {
  const items = scale(prefix)
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {items.map((i) => (
          <tr key={i.css}>
            <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'nowrap' }}>
              {prefix}/{i.name}
            </td>
            <td style={{ ...cellStyle, width: '60%' }}>
              <div style={{ height: 10, width: `var(${i.css})`, minWidth: 2, borderRadius: 'var(--radius-xs)', background: 'var(--color-brand-primary)' }} />
            </td>
            <td style={{ ...cellStyle, color: 'var(--color-text-secondary)', textAlign: 'right' }}>{i.px}px</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Radius scale as corner samples on a fixed-size box — the box is doc chrome, the radius is the token. */
export function RadiusScale() {
  const items = scale('radius')
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
      {items.map((i) => (
        <figure key={i.css} style={{ margin: 0, textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: 'var(--color-surface-sunken)',
              border: '1px solid var(--color-border-default)',
              borderRadius: `var(${i.css})`,
            }}
          />
          <figcaption className="text-caption" style={{ marginTop: 'var(--space-2xs)', color: 'var(--color-text-secondary)' }}>
            radius/{i.name}
            <br />
            {i.px}px
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/** Border width scale — a stroke sample at each width, read from the token. */
export function BorderWidthScale() {
  const items = scale('border-width')
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
      {items.map((i) => (
        <figure key={i.css} style={{ margin: 0, textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-default)',
              border: `var(${i.css}) solid var(--color-border-default)`,
            }}
          />
          <figcaption className="text-caption" style={{ marginTop: 'var(--space-2xs)', color: 'var(--color-text-secondary)' }}>
            border-width/{i.name}
            <br />
            {i.px}px
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
