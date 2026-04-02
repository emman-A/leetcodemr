'use client'

import { Gamepad2 } from 'lucide-react'
import DifficultyBadge from '@/components/DifficultyBadge'
import type { LineGameQuestion } from '@/components/line-game/LineGameSession'

export default function LeetGameQuestionList({
  deck,
  onSelect,
}: {
  deck: LineGameQuestion[]
  onSelect: (index: number) => void
}) {
  if (!deck.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-600">
        <p>No questions with Python solutions in this list.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <p className="text-sm text-gray-600 mb-4">
        Questions are listed in <strong>daily plan order</strong> (or by id if you have no plan). Tap one to practice
        line recall on that solution.
      </p>
      <ul className="rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100 overflow-hidden">
        {deck.map((q, i) => (
          <li key={q.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-indigo-50/80 transition-colors group"
            >
              <span className="shrink-0 w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center text-sm font-bold text-gray-600 group-hover:text-indigo-700 tabular-nums">
                {i + 1}
              </span>
              <span className="flex-1 min-w-0 pt-0.5">
                <span className="font-semibold text-gray-900 group-hover:text-indigo-900 block truncate">{q.title}</span>
                <span className="mt-1 inline-flex items-center gap-2">
                  <DifficultyBadge difficulty={q.difficulty} />
                </span>
              </span>
              <Gamepad2
                size={18}
                className="shrink-0 text-gray-300 group-hover:text-indigo-500 mt-1"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
