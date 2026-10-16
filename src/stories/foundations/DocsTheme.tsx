import { useEffect, useState } from 'react'
import { addons } from 'storybook/preview-api'

/**
 * Docs pages (Foundations) render outside any <Story>, so the preview decorator in
 * .storybook/preview.tsx — which sets <html data-theme> from the Theme toolbar — never runs for
 * them. This reads the manager's current theme from its URL on mount, then follows the same
 * "globalsUpdated" / "updateGlobals" addons-channel events the toolbar itself fires, so the live
 * token examples on this page follow it too — no separate Dark/Light copy of the page.
 */
function initialTheme(): string {
  try {
    const search = (window.parent !== window ? window.parent.location.search : window.location.search) || ''
    return /globals=[^&]*theme:([a-z]+)/.exec(search)?.[1] ?? document.documentElement.dataset.theme ?? 'dark'
  } catch {
    // Cross-origin parent (e.g. an embedded/composed Storybook): fall back to the current attribute.
    return document.documentElement.dataset.theme ?? 'dark'
  }
}

export function DocsTheme() {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    const channel = addons.getChannel()
    const onGlobals = (payload: { globals?: { theme?: string } }) => {
      if (payload?.globals?.theme) setTheme(payload.globals.theme)
    }
    channel.on('globalsUpdated', onGlobals)
    channel.on('updateGlobals', onGlobals)
    return () => {
      channel.off('globalsUpdated', onGlobals)
      channel.off('updateGlobals', onGlobals)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark'
  }, [theme])

  return null
}
