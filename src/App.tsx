import { useEffect, useState } from 'react'
import { WhatIUnderstood, type ChipSnapshot } from '@/patterns/WhatIUnderstood'

type Theme = 'dark' | 'light'

const FIGMA_URL =
  'https://www.figma.com/design/oYKI1xZAtJvaO62wPJhN8L/AI-native-mobile-banking?node-id=31-123'
const STORYBOOK_URL = 'https://serenissima13.github.io/ai-native-banking-handoff/storybook/'
const REPO_URL = 'https://github.com/serenissima13/ai-native-banking-handoff'

/**
 * The live demo is about one component: ParameterChip. The left column explains it and shows, live, the
 * props of each chip on the phone. The phone (Figma 05 Screens › 02 Understanding) is only there so the
 * component is seen doing its job — the context is secondary.
 */
export function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [chips, setChips] = useState<ChipSnapshot[]>([])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="page">
      <header className="intro">
        <p className="eyebrow">Live demo · Component handoff</p>
        <h1>ParameterChip</h1>
        <p className="intro__lead">
          A value the assistant took from the person's own words, shown where it was understood and changeable in
          place. Three separate questions decide how it looks and behaves:
        </p>

        <dl className="axes">
          <div>
            <dt>Type</dt>
            <dd>How is it changed? <b>Input</b> is typed in place · <b>Select</b> is picked from a list.</dd>
          </div>
          <div>
            <dt>State</dt>
            <dd>Where did it come from? Confirmed · Assumed · Missing · Edited · Output.</dd>
          </div>
          <div>
            <dt>Interaction</dt>
            <dd>What is happening now? Open belongs to Select, Editing to Input.</dd>
          </div>
        </dl>

        <section className="inspector" aria-labelledby="inspector-title">
          <h2 id="inspector-title" className="inspector__title">On the phone, right now</h2>
          <p className="inspector__hint">Tap the date or the amount on the phone and watch the props change.</p>
          <ul className="inspector__list">
            {chips.map((c) => (
              <li key={c.parameter} className="inspector__chip">
                <p className="inspector__name">
                  {c.parameter} <span>{c.value}</span>
                </p>
                <dl className="inspector__props">
                  <div><dt>Type</dt><dd>{c.type}</dd></div>
                  <div><dt>State</dt><dd data-changed={c.state === 'edited' || undefined}>{c.state}</dd></div>
                  <div><dt>Interaction</dt><dd data-active={c.interaction !== 'rest' || undefined}>{c.interaction}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <div className="segmented" role="radiogroup" aria-label="Theme">
          {(['dark', 'light'] as const).map((t) => (
            <button key={t} role="radio" aria-checked={theme === t} onClick={() => setTheme(t)}>
              {t === 'dark' ? 'Dark' : 'Light'}
            </button>
          ))}
        </div>

        <nav className="intro__links" aria-label="More about ParameterChip">
          <a className="link" href={STORYBOOK_URL}>Every state, specs and tests · Storybook</a>
          <a className="link" href={FIGMA_URL} target="_blank" rel="noreferrer">Component in Figma ↗</a>
          <a className="link" href={REPO_URL} target="_blank" rel="noreferrer">Code · GitHub ↗</a>
        </nav>
      </header>

      <figure className="stage">
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
              <WhatIUnderstood onChange={setChips} />
            </div>
            {/* ChatComposer — shown for context only; this demo has no assistant behind it */}
            <div className="device__composer" aria-hidden="true">Reply or ask…</div>
            <div className="device__home" aria-hidden="true" />
          </main>
        </div>
        <figcaption className="stage__caption">In context · screen 02 “What I understood”</figcaption>
      </figure>
    </div>
  )
}
