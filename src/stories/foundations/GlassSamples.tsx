import { useState } from 'react'
import { effectStyles, slug } from './tokens'

/**
 * Glass & elevation — every effect style over the same colourful backdrop App.css paints the page with,
 * through the generated .effect-* classes (styles.css). The toggle simulates `prefers-reduced-transparency`
 * by swapping in the exact fallback tokens scripts/build-tokens.mjs already generates for that media query
 * (color/surface/raised, blur → 0) — not a media query the browser chrome lets you flip from here.
 */
export function GlassSamples() {
  const [reduced, setReduced] = useState(false)
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-lg)' }}>
        <input type="checkbox" checked={reduced} onChange={(e) => setReduced(e.target.checked)} />
        <span className="text-label-md">Simulate Reduce Transparency</span>
      </label>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-lg)',
          padding: 'var(--space-xl)',
          borderRadius: 'var(--radius-lg)',
          background:
            'radial-gradient(20rem 14rem at 15% 10%, var(--color-glass-tint-brand), transparent 60%), radial-gradient(18rem 14rem at 90% 30%, var(--color-glass-tint-ai), transparent 60%), var(--color-bg-canvas)',
        }}
      >
        {effectStyles.map((e) => (
          <div
            key={e.name}
            className={reduced ? undefined : `effect-${slug(e.name)}`}
            style={{
              width: 180,
              height: 96,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 'var(--radius-lg)',
              background: reduced ? 'var(--color-surface-raised)' : `var(--color-glass-fill-${e.name.split('/')[1]})`,
            }}
          >
            <span className="text-caption" style={{ color: 'var(--color-text-secondary)' }}>
              effect/{e.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
