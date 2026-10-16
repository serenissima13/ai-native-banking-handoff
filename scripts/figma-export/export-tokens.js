/*
 * Figma → JSON token export · runs INSIDE Figma (Plugin API).
 *
 * Two ways to run it:
 *   1. As a development plugin: Figma desktop → Plugins → Development → Import plugin from manifest…
 *      → choose scripts/figma-export/manifest.json → run "Export tokens" → copy the JSON it shows
 *      into tokens/figma-tokens.json.
 *   2. Through an AI agent with the Figma MCP (use_figma): run exportTokens(CONFIG) and save the result.
 *
 * Then: npm run tokens   (scripts/build-tokens.mjs turns the JSON into src/tokens/*.css)
 *
 * What it exports: every Semantic variable (all modes), the Component variables whose name starts with
 * one of CONFIG.componentPrefixes, every Primitive they reference (followed through aliases), and the
 * text and effect styles listed in CONFIG. Names come from each variable's WEB code syntax.
 */
const CONFIG = {
  semanticCollection: 'Semantic',
  componentCollection: 'Component',
  componentPrefixes: ['parameter-chip/'],
  textStyles: ['display/amount', 'label/md', 'caption'],
  effectStyles: ['glass/thin', 'glass/regular', 'glass/thick'],
}

async function exportTokens(config) {
  const cssName = (v) => {
    const web = v.codeSyntax && v.codeSyntax.WEB
    const m = web && web.match(/--[\w-]+/)
    return m ? m[0] : '--' + v.name.replace(/[\/\s.]+/g, '-').toLowerCase()
  }
  const hex = (x) => Math.round(x * 255)
  const color = (c) => {
    const a = c.a === undefined ? 1 : c.a
    return a >= 0.999
      ? '#' + [c.r, c.g, c.b].map((x) => hex(x).toString(16).padStart(2, '0')).join('')
      : `rgba(${hex(c.r)}, ${hex(c.g)}, ${hex(c.b)}, ${+a.toFixed(3)})`
  }

  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const byId = {}
  for (const c of collections)
    for (const id of c.variableIds) {
      const v = await figma.variables.getVariableByIdAsync(id)
      if (v) byId[id] = { v, c }
    }

  const keep = new Set()
  const queue = []
  const add = (id) => { if (byId[id] && !keep.has(id)) { keep.add(id); queue.push(id) } }
  for (const id in byId) {
    const { v, c } = byId[id]
    if (c.name === config.semanticCollection) add(id)
    if (c.name === config.componentCollection && config.componentPrefixes.some((p) => v.name.startsWith(p))) add(id)
  }

  const allEffects = await figma.getLocalEffectStylesAsync()
  const effectSources = allEffects.filter((s) => config.effectStyles.includes(s.name))
  for (const s of effectSources)
    for (const e of s.effects) if (e.boundVariables && e.boundVariables.color) add(e.boundVariables.color.id)

  while (queue.length) {
    const id = queue.pop()
    for (const val of Object.values(byId[id].v.valuesByMode))
      if (val && val.type === 'VARIABLE_ALIAS') add(val.id)
  }

  const value = (v, val) => {
    if (val && val.type === 'VARIABLE_ALIAS') return { alias: cssName(byId[val.id].v) }
    if (v.resolvedType === 'COLOR') return color(val)
    return val
  }

  const variables = []
  for (const c of collections)
    for (const id of c.variableIds) {
      if (!keep.has(id)) continue
      const v = byId[id].v
      const values = {}
      for (const m of c.modes) values[m.name] = value(v, v.valuesByMode[m.modeId])
      variables.push({ name: v.name, css: cssName(v), collection: c.name, type: v.resolvedType, scopes: v.scopes, values })
    }

  const weights = { Thin: 100, ExtraLight: 200, Light: 300, Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800, Black: 900 }
  const textStyles = (await figma.getLocalTextStylesAsync())
    .filter((s) => config.textStyles.includes(s.name))
    .map((s) => ({
      name: s.name,
      fontFamily: s.fontName.family,
      fontWeight: weights[s.fontName.style.replace(/\s|Italic/g, '')] || 400,
      fontSize: s.fontSize,
      lineHeight: s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value + 'px' : s.lineHeight.unit === 'PERCENT' ? s.lineHeight.value / 100 : 'normal',
      letterSpacing: s.letterSpacing.unit === 'PIXELS' ? s.letterSpacing.value + 'px' : s.letterSpacing.value / 100 + 'em',
    }))

  const effectStyles = effectSources.map((s) => ({
    name: s.name,
    effects: s.effects.filter((e) => e.visible !== false).map((e) => ({
      type: e.type,
      radius: e.radius,
      spread: e.spread || 0,
      x: e.offset ? e.offset.x : 0,
      y: e.offset ? e.offset.y : 0,
      color: e.boundVariables && e.boundVariables.color ? { alias: cssName(byId[e.boundVariables.color.id].v) } : e.color ? color(e.color) : null,
    })),
  }))

  return {
    source: { file: figma.root.name, exportedAt: new Date().toISOString(), config },
    collections: collections.filter((c) => c.variableIds.some((id) => keep.has(id))).map((c) => ({ name: c.name, modes: c.modes.map((m) => m.name) })),
    variables,
    textStyles,
    effectStyles,
  }
}

// When run as a development plugin: show the JSON so it can be copied.
if (typeof figma !== 'undefined' && typeof figma.showUI === 'function') {
  exportTokens(CONFIG).then((data) => {
    const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c')
    figma.showUI(
      `<style>body{margin:0;font:12px system-ui}textarea{width:100%;height:calc(100vh - 36px);border:0;padding:8px;box-sizing:border-box;font:11px ui-monospace,monospace}p{margin:8px}</style>` +
        `<p>${data.variables.length} variables · copy everything into tokens/figma-tokens.json</p><textarea readonly>${json}</textarea>`,
      { width: 520, height: 640 },
    )
  })
}
