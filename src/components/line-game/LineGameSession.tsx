'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronLeft, ChevronRight, Eye, ListOrdered } from 'lucide-react'
import {
  pickBlankLines,
  normalizeAnswerLine,
  type BlankLinePick,
} from '@/lib/lineGame/pickBlankLines'
import DifficultyBadge from '@/components/DifficultyBadge'

export interface LineGameQuestion {
  id: number
  title: string
  slug: string
  difficulty: string
  python_solution?: string
}

type BlankUiState = {
  input: string
  wrongCount: number
  solved: boolean
  revealed: boolean
}

function buildInitialBlanks(blanks: BlankLinePick[]): BlankUiState[] {
  return blanks.map(() => ({
    input: '',
    wrongCount: 0,
    solved: false,
    revealed: false,
  }))
}

export default function LineGameSession({
  deck,
  startIndex = 0,
}: {
  deck: LineGameQuestion[]
  startIndex?: number
}) {
  const [idx, setIdx] = useState(startIndex)
  const [sessionRecall, setSessionRecall] = useState(0)
  const prevSolvedCount = useRef(0)
  const q = deck[idx]

  const picked = useMemo(() => {
    if (!q?.python_solution) return null
    return pickBlankLines(q.python_solution)
  }, [q])

  const [blankStates, setBlankStates] = useState<BlankUiState[]>([])

  useLayoutEffect(() => {
    prevSolvedCount.current = 0
    if (!picked?.blanks.length) {
      setBlankStates([])
      return
    }
    setBlankStates(buildInitialBlanks(picked.blanks))
  }, [picked, q?.id])

  useEffect(() => {
    const n = blankStates.filter(b => b.solved).length
    const delta = n - prevSolvedCount.current
    if (delta > 0) setSessionRecall(s => s + delta)
    prevSolvedCount.current = n
  }, [blankStates])

  const checkLine = useCallback(
    (blankOrder: number) => {
      if (!picked) return
      const expected = picked.blanks[blankOrder]?.expected
      if (expected === undefined) return
      setBlankStates(prev => {
        const row = prev[blankOrder]
        if (!row || row.solved || row.revealed) return prev
        const ok = normalizeAnswerLine(row.input) === normalizeAnswerLine(expected)
        if (ok) {
          const next = [...prev]
          next[blankOrder] = { ...row, solved: true }
          return next
        }
        const wrongCount = row.wrongCount + 1
        const next = [...prev]
        next[blankOrder] = {
          ...row,
          wrongCount,
          revealed: wrongCount >= 3,
        }
        return next
      })
    },
    [picked]
  )

  const solvedCount = blankStates.filter(b => b.solved).length
  const totalBlanks = picked?.blanks.length ?? 0
  const allDone = totalBlanks > 0 && solvedCount === totalBlanks

  const go = (d: number) => {
    setIdx(i => Math.max(0, Math.min(deck.length - 1, i + d)))
  }

  if (!deck.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-600">
        <p>No questions with Python solutions in this list.</p>
      </div>
    )
  }

  if (!q) return null

  if (!q.python_solution) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-4">No Python solution for this problem.</p>
        <button
          type="button"
          onClick={() => go(1)}
          className="text-indigo-600 font-medium hover:underline"
        >
          Next question
        </button>
      </div>
    )
  }

  if (!picked || picked.blanks.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-bold text-gray-900">{q.title}</h1>
          <DifficultyBadge difficulty={q.difficulty} />
        </div>
        <p className="text-gray-600 mb-4">Could not pick practice lines for this solution (too short or sparse).</p>
        <button
          type="button"
          onClick={() => go(1)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          Skip to next
        </button>
      </div>
    )
  }

  const lines = picked.lines
  const blankIndexSet = new Set(picked.blanks.map(b => b.lineIndex))
  const blankByLine = new Map<number, number>()
  picked.blanks.forEach((b, i) => blankByLine.set(b.lineIndex, i))

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-gray-900">{q.title}</h1>
          <DifficultyBadge difficulty={q.difficulty} />
          <Link
            href={`/question/${q.id}`}
            className="text-sm text-indigo-600 hover:underline ml-auto"
          >
            Open problem
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          Fill in the blank lines (same indentation as the original). Three checks per line; hints escalate, then the
          line is shown.
        </p>
      </header>

      {/* Progress */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-gray-600">
          Question {idx + 1} / {deck.length}
        </span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-600 flex items-center gap-1">
          <ListOrdered size={16} className="text-indigo-500" />
          This problem: {solvedCount}/{totalBlanks}
        </span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-600">Session recall: {sessionRecall}</span>
        {allDone && (
          <span className="text-green-600 font-medium">All lines match — nice.</span>
        )}
      </div>
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden mb-6">
        <div
          className="h-full bg-indigo-500 transition-[width] duration-300"
          style={{
            width: `${Math.min(
              100,
              ((idx + (totalBlanks ? solvedCount / totalBlanks : 0)) / deck.length) * 100
            )}%`,
          }}
        />
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-700 bg-[#282c34] text-sm font-mono">
        <div className="px-3 py-2 border-b border-gray-600 text-gray-400 text-xs">Python (Simply Leet)</div>
        <div className="p-4 overflow-x-auto max-h-[min(70vh,520px)] overflow-y-auto">
          <pre className="text-[13px] leading-relaxed text-[#abb2bf] whitespace-pre">
            {lines.map((line, lineIdx) => {
              const bi = blankByLine.get(lineIdx)
              if (bi === undefined) {
                return (
                  <div key={lineIdx}>
                    <span className="text-[#5c6370] select-none mr-3 inline-block w-8 text-right text-[11px] tabular-nums">
                      {lineIdx + 1}
                    </span>
                    <span>{line || ' '}</span>
                  </div>
                )
              }

              const st = blankStates[bi]
              const expected = picked.blanks[bi].expected
              const showAnswer = st?.solved || st?.revealed
              const norm = normalizeAnswerLine(expected)
              const hintLen = norm.length
              const prefix = norm.slice(0, 4)

              let border = 'border-gray-600'
              let bg = 'bg-[#1e222a]'
              if (st?.solved) {
                border = 'border-green-500/70'
                bg = 'bg-green-950/40'
              } else if (st?.revealed) {
                border = 'border-amber-500/50'
                bg = 'bg-amber-950/30'
              }

              return (
                <div key={lineIdx} className="my-2">
                  <span className="text-[#5c6370] select-none mr-3 inline-block w-8 text-right text-[11px] align-top tabular-nums pt-1.5">
                    {lineIdx + 1}
                  </span>
                  <span className="inline-block align-top w-[calc(100%-2.5rem)]">
                    {showAnswer ? (
                      <span
                        className={`block px-2 py-1 rounded border ${border} ${bg} ${
                          st?.solved ? 'text-green-300' : 'text-amber-200'
                        }`}
                      >
                        {expected}
                      </span>
                    ) : (
                      <>
                        <textarea
                          value={st?.input ?? ''}
                          onChange={e => {
                            const v = e.target.value
                            setBlankStates(prev => {
                              const next = [...prev]
                              next[bi] = { ...next[bi], input: v }
                              return next
                            })
                          }}
                          rows={Math.max(2, Math.min(8, expected.split('\n').length + 1))}
                          spellCheck={false}
                          className={`w-full px-2 py-1.5 rounded border ${border} ${bg} text-[#abb2bf] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y min-h-[2.5rem]`}
                          placeholder="Type the full line…"
                        />
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => checkLine(bi)}
                            disabled={st?.solved || st?.revealed}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-40"
                          >
                            <Check size={14} />
                            Check
                          </button>
                          {st && st.wrongCount >= 1 && !st.solved && (
                            <span className="text-xs text-gray-400">
                              Length: {hintLen} chars (normalized spaces)
                            </span>
                          )}
                          {st && st.wrongCount >= 2 && !st.solved && !st.revealed && (
                            <span className="text-xs text-amber-300/90">Starts with: {JSON.stringify(prefix)}</span>
                          )}
                          {st && st.revealed && !st.solved && (
                            <span className="text-xs text-amber-400 flex items-center gap-1">
                              <Eye size={12} />
                              Revealed after 3 tries
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </span>
                </div>
              )
            })}
          </pre>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={idx <= 0}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
          Previous
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={idx >= deck.length - 1}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
