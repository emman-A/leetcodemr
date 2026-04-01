/**
 * Heuristic selection of 2–3 "meaty" Python lines for line-fill recall.
 * Skips comments, imports, blank lines, def/class headers, and trivial lines.
 */

export interface BlankLinePick {
  lineIndex: number
  /** Raw line from source (preserve indentation for typing) */
  expected: string
}

export interface PickBlankLinesResult {
  blanks: BlankLinePick[]
  lines: string[]
}

const MAX_BLANKS = 3
const MIN_BLANKS = 2

function isSkippableLine(line: string): boolean {
  const t = line.trim()
  if (!t) return true
  if (t.startsWith('#')) return true
  if (/^import\s|^from\s+\S+\s+import/.test(t)) return true
  if (/^\s*def\s/.test(line)) return true
  if (/^\s*class\s+\w+/.test(line) && /:\s*$/.test(t)) return true
  if (t === 'pass' || t === '...') return true
  if (/^#\s*(Example|print|usage|Expected)/i.test(t)) return true
  return false
}

function scoreLine(line: string): number {
  const t = line.trim()
  if (t.length < 5) return 0
  let s = 0
  if (/\b(if|while|for|elif)\b/.test(t)) s += 7
  if (/\belse\s*:/.test(t)) s += 5
  if (/\breturn\b/.test(t)) s += 6
  if (/[^=!]=[^=]/.test(t) || /\+=|-=|\*=|\/\/=/.test(t)) s += 4
  if (/[=]{2}|!=|<=|>=/.test(t) && /\b(if|while|elif)\b/.test(t)) s += 3
  if (/\.(append|pop|add|get|popleft|appendleft)|heapq|deque|defaultdict|Counter|bisect|heapify|heappush|heappop/.test(t)) s += 4
  if (/\[|\]/.test(t) && (/\[.*\] =/.test(t) || /=\s*\[/.test(t))) s += 2
  s += Math.min(Math.floor(t.length / 40), 2)
  return s
}

function gatherScored(lines: string[], minScore: number) {
  const out: { idx: number; score: number }[] = []
  for (let i = 0; i < lines.length; i++) {
    if (isSkippableLine(lines[i])) continue
    const sc = scoreLine(lines[i])
    if (sc >= minScore) out.push({ idx: i, score: sc })
  }
  out.sort((a, b) => b.score - a.score || a.idx - b.idx)
  return out
}

/** Normalize for equality check */
export function normalizeAnswerLine(s: string): string {
  return s.trim().replace(/\s+/g, ' ')
}

export function pickBlankLines(pythonCode: string): PickBlankLinesResult {
  const lines = pythonCode.replace(/\r\n/g, '\n').split('\n')

  let scored = gatherScored(lines, 5)
  if (scored.length < MIN_BLANKS) scored = gatherScored(lines, 3)
  if (scored.length < MIN_BLANKS) scored = gatherScored(lines, 1)
  if (scored.length === 0) {
    const fallback: { idx: number; score: number }[] = []
    for (let i = 0; i < lines.length; i++) {
      if (isSkippableLine(lines[i])) continue
      const t = lines[i].trim()
      if (t.length >= 8) fallback.push({ idx: i, score: t.length })
    }
    fallback.sort((a, b) => b.score - a.score)
    const take = Math.min(MAX_BLANKS, Math.max(1, fallback.length))
    const blanks = fallback.slice(0, take).map(f => ({
      lineIndex: f.idx,
      expected: lines[f.idx],
    }))
    return { blanks, lines }
  }

  const pickCount = Math.min(MAX_BLANKS, scored.length)
  const chosen = scored.slice(0, pickCount)
  const blanks: BlankLinePick[] = chosen.map(c => ({
    lineIndex: c.idx,
    expected: lines[c.idx],
  }))

  return { blanks, lines }
}
