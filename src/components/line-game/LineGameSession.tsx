'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react'
import { pickBlankLines, normalizeAnswerLine, type BlankLinePick } from '@/lib/lineGame/pickBlankLines'
import LineGameHighlightedCode, { splitLeadingIndent } from '@/components/line-game/LineGameHighlightedCode'
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
        const { indent } = splitLeadingIndent(expected)
        const attempt = indent + row.input
        const ok = normalizeAnswerLine(attempt) === normalizeAnswerLine(expected)
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
          Fill in each blank line after the leading spaces (shown for you). Three checks per line; hints escalate, then
          the line is shown with the same highlighting as the solution on the question page.
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

      <LineGameHighlightedCode
        lines={lines}
        blanks={picked.blanks}
        blankStates={blankStates}
        onInputChange={(bi, v) => {
          setBlankStates(prev => {
            const next = [...prev]
            next[bi] = { ...next[bi], input: v }
            return next
          })
        }}
        onCheck={checkLine}
      />

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
