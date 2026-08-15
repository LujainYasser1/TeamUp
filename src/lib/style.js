/**
 * Turns a plain CSS declaration string into a React style object.
 * The design was authored as inline CSS strings, so keeping them verbatim
 * guarantees pixel-identical output — this helper is the only translation layer.
 */
const cache = new Map()

function toProp(name) {
  const n = name.trim()
  if (n.startsWith('--')) return n // custom property, passed through as-is
  if (n.startsWith('-webkit-')) return 'Webkit' + camel(n.slice(8))
  if (n.startsWith('-moz-')) return 'Moz' + camel(n.slice(5))
  if (n.startsWith('-ms-')) return 'ms' + camel(n.slice(4))
  return n.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function camel(n) {
  const c = n.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase())
  return c.charAt(0).toUpperCase() + c.slice(1)
}

/** Split on ';' but not inside parentheses (gradients, calc, url…). */
function splitDecls(css) {
  const out = []
  let depth = 0, start = 0
  for (let i = 0; i < css.length; i++) {
    const ch = css[i]
    if (ch === '(') depth++
    else if (ch === ')') depth--
    else if (ch === ';' && depth === 0) { out.push(css.slice(start, i)); start = i + 1 }
  }
  out.push(css.slice(start))
  return out
}

export function __css(css) {
  if (!css) return undefined
  const hit = cache.get(css)
  if (hit) return hit
  const style = {}
  for (const decl of splitDecls(css)) {
    const idx = decl.indexOf(':')
    if (idx === -1) continue
    const prop = decl.slice(0, idx)
    const value = decl.slice(idx + 1).trim()
    if (!prop.trim() || !value) continue
    style[toProp(prop)] = value
  }
  cache.set(css, style)
  return style
}

export const s = __css
