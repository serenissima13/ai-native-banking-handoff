/**
 * Data for the Foundations docs page — read directly from tokens/figma-tokens.json,
 * the same export scripts/build-tokens.mjs turns into src/tokens/tokens.css + styles.css.
 * Nothing here is a hand-typed design value: colours render through the generated CSS
 * custom properties (var(--…)), so they switch with the Theme toolbar for free; scales
 * and type styles are read straight from the JSON and resolved the same way the build
 * script resolves them (alias → alias → literal).
 */
import tokensJson from '../../../tokens/figma-tokens.json'

export interface Variable {
  name: string
  css: string
  collection: 'Primitives' | 'Semantic' | 'Component'
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'
  scopes: string[]
  values: Record<string, unknown>
}

export interface TextStyle {
  name: string
  fontFamily: string
  fontWeight: number
  fontSize: number
  lineHeight: string
  letterSpacing: string
}

export interface EffectStyle {
  name: string
  effects: { type: string; radius: number; spread: number; x: number; y: number; color: { alias: string } | null }[]
}

interface TokensFile {
  variables: Variable[]
  textStyles: TextStyle[]
  effectStyles: EffectStyle[]
}

const tokens = tokensJson as unknown as TokensFile

/** Same slug as scripts/build-tokens.mjs: "glass/thin" → "glass-thin". */
export const slug = (name: string) => name.replace(/[/\s.]+/g, '-').toLowerCase()

const primitives = tokens.variables.filter((v) => v.collection === 'Primitives')
const semantic = tokens.variables.filter((v) => v.collection === 'Semantic')
const byCss = new Map(tokens.variables.map((v) => [v.css, v]))

/** Follows alias → alias → literal, the same chain the generated CSS encodes with var(). */
function resolveNumber(value: unknown): number {
  if (value && typeof value === 'object' && 'alias' in (value as Record<string, unknown>)) {
    const target = byCss.get((value as { alias: string }).alias)
    return target ? resolveNumber(Object.values(target.values)[0]) : NaN
  }
  return typeof value === 'number' ? value : NaN
}

/** One Primitive colour ramp, e.g. "ink" → every color/ink/* step, lowest to highest. */
export function colorRamp(family: string) {
  return primitives
    .filter((v) => v.type === 'COLOR' && v.name.startsWith(`color/${family}/`))
    .map((v) => ({ css: v.css, step: v.name.split('/').pop()!, hex: String(Object.values(v.values)[0]) }))
    .sort((a, b) => Number(a.step) - Number(b.step))
}

/** Every Semantic colour token, grouped by its second path segment: color/text/*, color/surface/*, … */
export function semanticColorGroups() {
  const groups = new Map<string, Variable[]>()
  for (const v of semantic) {
    if (!v.name.startsWith('color/')) continue
    const group = v.name.split('/')[1]
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group)!.push(v)
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
}

/** A named Semantic scale (space, radius, size, border-width), resolved to px and sorted ascending. */
export function scale(prefix: 'space' | 'radius' | 'size' | 'border-width') {
  return semantic
    .filter((v) => v.name.startsWith(`${prefix}/`))
    .map((v) => ({ css: v.css, name: v.name.slice(prefix.length + 1), px: resolveNumber(Object.values(v.values)[0]) }))
    .filter((v) => Number.isFinite(v.px))
    .sort((a, b) => a.px - b.px)
}

export const textStyles = tokens.textStyles
export const effectStyles = tokens.effectStyles
