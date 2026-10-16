import { slug, textStyles } from './tokens'

const weightName: Record<number, string> = { 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'Semibold' }

const sample = (name: string) => {
  // Amounts get a figure worth reading in tabular numerals; everything else, a short label.
  if (name === 'display/amount') return '≈ €3,000'
  if (name === 'label/md') return 'Amount · €3,000'
  return 'assumed'
}

/** Every Figma text style, rendered through its generated .text-* class — not a hand-set font anywhere. */
export function TypeSamples() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
      {textStyles.map((t) => (
        <div key={t.name} style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-md)' }}>
          <p className={`text-${slug(t.name)}`} style={{ margin: 0 }}>
            {sample(t.name)}
          </p>
          <p className="text-caption" style={{ margin: 'var(--space-2xs) 0 0', color: 'var(--color-text-secondary)' }}>
            <code>.text-{slug(t.name)}</code> · {t.fontFamily} {weightName[t.fontWeight] ?? t.fontWeight} · {t.fontSize}/
            {t.lineHeight.replace('px', '')} · {t.letterSpacing === '0em' ? 'no tracking' : t.letterSpacing}
          </p>
        </div>
      ))}
    </div>
  )
}
