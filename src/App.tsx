import { useEffect, useState } from 'react'
import { WhatIUnderstood } from '@/patterns/WhatIUnderstood'

type Theme = 'dark' | 'light'

const FIGMA_URL =
  'https://www.figma.com/design/oYKI1xZAtJvaO62wPJhN8L/AI-native-mobile-banking?node-id=253-361'
const STORYBOOK_URL = 'https://serenissima13.github.io/ai-native-banking-handoff/storybook/'
const REPO_URL = 'https://github.com/serenissima13/ai-native-banking-handoff'

/**
 * The live demo: one moment of the product at phone width — Figma 05 Screens › 02 Understanding,
 * in the 402 px frame of the Figma screens. Every state, the specs and the tests live in Storybook.
 */
export function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Live demo · AI-native mobile banking</p>
          <h1>What I understood</h1>
        </div>
        <div className="segmented" role="radiogroup" aria-label="Theme">
          {(['dark', 'light'] as const).map((t) => (
            <button key={t} role="radio" aria-checked={theme === t} onClick={() => setTheme(t)}>
              {t === 'dark' ? 'Dark' : 'Light'}
            </button>
          ))}
        </div>
      </header>

      <main className="phone">
        {/* ChatTopBar — the conversation's name, as on the screen (no controls in this demo) */}
        <p className="phone__title">Summer holiday savings plan for next year</p>
        <WhatIUnderstood />
        {/* ChatComposer — shown for context only; this demo has no assistant behind it */}
        <div className="phone__composer" aria-hidden="true">Reply or ask…</div>
      </main>

      <footer className="page__footer">
        <a className="link" href={STORYBOOK_URL}>Every state, specs and tests · Storybook</a>
        <a className="link" href={FIGMA_URL} target="_blank" rel="noreferrer">Design · Figma ↗</a>
        <a className="link" href={REPO_URL} target="_blank" rel="noreferrer">Code · GitHub ↗</a>
      </footer>
    </div>
  )
}
