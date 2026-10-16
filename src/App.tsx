import { useEffect, useState } from 'react'
import { WhatIUnderstood } from '@/patterns/WhatIUnderstood'

type Theme = 'dark' | 'light'

const FIGMA_URL =
  'https://www.figma.com/design/oYKI1xZAtJvaO62wPJhN8L/AI-native-mobile-banking?node-id=253-361'
const STORYBOOK_URL = 'https://serenissima13.github.io/ai-native-banking-handoff/storybook/'
const REPO_URL = 'https://github.com/serenissima13/ai-native-banking-handoff'

/**
 * The live demo: one moment of the product — Figma 05 Screens › 02 Understanding — inside a simple phone,
 * the 402 × 874 frame of the Figma screens. On a real phone the frame steps aside and the screen fills it.
 * Every state, the specs and the tests live in Storybook.
 */
export function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="page">
      <header className="intro">
        <p className="eyebrow">Live demo · AI-native mobile banking</p>
        <h1>What I understood</h1>
        <p className="intro__lead">
          The assistant reads a request back as values you can correct where they stand. Tap the date to pick another
          month, or the amount to type a new one.
        </p>
        <div className="segmented" role="radiogroup" aria-label="Theme">
          {(['dark', 'light'] as const).map((t) => (
            <button key={t} role="radio" aria-checked={theme === t} onClick={() => setTheme(t)}>
              {t === 'dark' ? 'Dark' : 'Light'}
            </button>
          ))}
        </div>
        <nav className="intro__links" aria-label="More">
          <a className="link" href={STORYBOOK_URL}>Every state, specs and tests · Storybook</a>
          <a className="link" href={FIGMA_URL} target="_blank" rel="noreferrer">Design · Figma ↗</a>
          <a className="link" href={REPO_URL} target="_blank" rel="noreferrer">Code · GitHub ↗</a>
        </nav>
      </header>

      <div className="device">
        <main className="device__screen">
          {/* Status bar and home indicator are drawn, not real controls */}
          <div className="device__status" aria-hidden="true">
            <span>9:41</span>
            <span className="device__island" />
            <span className="device__battery" />
          </div>
          {/* ChatTopBar — the conversation's name, as on the screen */}
          <p className="device__title">Summer holiday savings plan for next year</p>
          <div className="device__content">
            <WhatIUnderstood />
          </div>
          {/* ChatComposer — shown for context only; this demo has no assistant behind it */}
          <div className="device__composer" aria-hidden="true">Reply or ask…</div>
          <div className="device__home" aria-hidden="true" />
        </main>
      </div>
    </div>
  )
}
