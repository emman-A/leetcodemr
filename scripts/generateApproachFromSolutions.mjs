/**
 * Fills algorithm_name + solution_steps from python_solution comments,
 * with fallbacks when comments are sparse. Skips entries that already have
 * both a name and at least two steps (curated entries stay put).
 *
 * Strips any step line matching /^function to …/i (duplicate of the title) so
 * older generated rows can be cleaned in one run.
 *
 * Usage: node scripts/generateApproachFromSolutions.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const jsonPath = path.join(root, 'public', 'questions_full.json')

const SKIP_IF_COMPLETE = true

function cleanStep(t) {
  t = t.replace(/\s+/g, ' ').trim()
  if (t.length > 220) t = t.slice(0, 217) + '…'
  if (!t.endsWith('.') && !t.endsWith(')') && t.length > 40) t += '.'
  return t
}

/** Remove duplicate title lines (same idea as algorithm_name) left from older runs */
function stripFunctionToSteps(steps) {
  if (!Array.isArray(steps)) return steps
  return steps.filter(s => !/^function to\b/i.test(String(s).trim()))
}

/** Pull meaningful # comment lines from Python source */
function extractCommentSteps(code) {
  if (!code || typeof code !== 'string') return []
  const lines = code.split('\n')
  const raw = []
  for (const line of lines) {
    const m = line.match(/^\s*#\s*(.+)$/)
    if (!m) continue
    let t = m[1].trim()
    if (t.length < 14) continue
    const low = t.toLowerCase()
    if (
      low.startsWith('example usage') ||
      low.startsWith('print(') ||
      /^expected output/i.test(t) ||
      /^write your solution/i.test(t) ||
      /^─/.test(t) ||
      /^function to\b/i.test(t)
    )
      continue
    raw.push(t)
  }
  // Dedupe consecutive identical
  const out = []
  for (const t of raw) {
    if (out.length && out[out.length - 1] === t) continue
    out.push(t)
  }
  // Cap length
  return out.slice(0, 12)
}

/** First "Function to ..." or first substantial # line → title */
function deriveAlgorithmName(title, tags, code, steps) {
  const lines = (code || '').split('\n')
  for (const line of lines) {
    const m = line.match(/^\s*#\s*Function to\s+(.+)$/i)
    if (m) {
      let s = m[1].trim().replace(/\s*$/, '')
      if (s.length > 5 && s.length < 90) {
        return s.charAt(0).toUpperCase() + s.slice(1)
      }
    }
  }
  if (steps.length > 0) {
    const s = steps[0]
    const short = s.split(/[.;]/)[0].trim()
    if (short.length >= 8 && short.length <= 85) {
      return short.charAt(0).toUpperCase() + short.slice(1)
    }
  }
  const tag = tags?.[0] || 'Standard'
  return `${tag}-style approach for ${title}`
}

function fallbackFromExplanation(explanation, title, tags) {
  const lines = (explanation || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
  const tc = lines.find(l => /^Time Complexity:/i.test(l))
  const sc = lines.find(l => /^Space Complexity:/i.test(l))
  const steps = []
  steps.push(`Understand the problem "${title}" and its constraints.`)
  if (tags?.length) steps.push(`Use patterns typical for ${tags.slice(0, 2).join(' and ')} problems.`)
  steps.push('Implement the core logic in code, updating state as you traverse the input.')
  if (tc) steps.push(tc.replace(/^Time Complexity:\s*/i, 'Time: '))
  if (sc) steps.push(sc.replace(/^Space Complexity:\s*/i, 'Space: '))
  steps.push('Return the result in the required format.')
  return {
    algorithm_name: `${tags?.[0] || 'Iterative'} solution`,
    solution_steps: steps.map(cleanStep),
  }
}

function processQuestion(q) {
  if (Array.isArray(q.solution_steps)) {
    const stripped = stripFunctionToSteps(q.solution_steps)
    if (stripped.length !== q.solution_steps.length) {
      q = { ...q, solution_steps: stripped }
    }
  }
  const hasName = q.algorithm_name && String(q.algorithm_name).trim()
  const hasSteps = Array.isArray(q.solution_steps) && q.solution_steps.length >= 2
  if (SKIP_IF_COMPLETE && hasName && hasSteps) return q

  const py = q.python_solution
  if (!py || !py.trim()) {
    if (!hasName || !hasSteps) {
      const fb = fallbackFromExplanation(q.explanation, q.title, q.tags)
      return { ...q, ...fb }
    }
    return q
  }

  let steps = extractCommentSteps(py).map(cleanStep)
  if (steps.length < 2) {
    const fb = fallbackFromExplanation(q.explanation, q.title, q.tags)
    if (steps.length === 1) {
      steps = [steps[0], ...fb.solution_steps.slice(1, 5)]
    } else {
      steps = fb.solution_steps
    }
  }

  const algorithm_name = deriveAlgorithmName(q.title, q.tags || [], py, steps)

  return {
    ...q,
    algorithm_name,
    solution_steps: steps,
  }
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
if (!Array.isArray(data)) {
  console.error('Expected array')
  process.exit(1)
}

let updated = 0
const out = data.map(q => {
  const before = JSON.stringify({ n: q.algorithm_name, s: q.solution_steps })
  const next = processQuestion(q)
  const after = JSON.stringify({ n: next.algorithm_name, s: next.solution_steps })
  if (before !== after) updated++
  return next
})

fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2) + '\n', 'utf8')
console.log(`Wrote ${jsonPath} — updated ${updated} / ${out.length} questions`)
