'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Calendar, Loader2 } from 'lucide-react'
import { getStudyPlan } from '@/lib/db'
import LineGameSession, { type LineGameQuestion } from '@/components/line-game/LineGameSession'
import LeetGameQuestionList from '@/components/line-game/LeetGameQuestionList'

interface StudyPlanRow {
  question_order: number[]
}

export default function LineGamePage() {
  const [all, setAll] = useState<LineGameQuestion[]>([])
  const [plan, setPlan] = useState<StudyPlanRow | null>(null)
  const [loading, setLoading] = useState(true)
  /** `null` = show question picker; number = playing that index in `deck` */
  const [playIndex, setPlayIndex] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const [qs, p] = await Promise.all([
        fetch('/questions_full.json').then(r => r.json()) as Promise<LineGameQuestion[]>,
        getStudyPlan(),
      ])
      setAll(qs)
      setPlan(p as StudyPlanRow | null)
      setLoading(false)
    }
    load()
  }, [])

  const deck = useMemo(() => {
    const withPy = all.filter(q => q.python_solution && q.python_solution.trim().length > 20)
    const byId = new Map(withPy.map(q => [q.id, q]))
    if (plan?.question_order?.length) {
      const ordered: LineGameQuestion[] = []
      for (const id of plan.question_order) {
        const q = byId.get(id)
        if (q) ordered.push(q)
      }
      return ordered
    }
    return [...withPy].sort((a, b) => a.id - b.id)
  }, [all, plan])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-gray-500 gap-2">
        <Loader2 className="animate-spin" size={22} />
        Loading LeetGame…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-2">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">LeetGame</h1>
        <p className="text-gray-600 mt-1 text-sm max-w-2xl">
          Line-recall practice on Simply Leet Python solutions. Pick a question below, then fill in the blank lines.
          Order matches your <strong>daily study plan</strong> when a plan exists; otherwise all problems with solutions
          (by id).
        </p>
        {!plan?.question_order?.length && (
          <p className="mt-3 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm inline-flex items-center gap-2">
            <Calendar size={16} />
            No study plan found — showing the full catalog order.{' '}
            <Link href="/daily" className="font-semibold text-indigo-700 underline">
              Set up Daily
            </Link>{' '}
            to match the list to your plan.
          </p>
        )}
      </div>
      {playIndex === null ? (
        <LeetGameQuestionList deck={deck} onSelect={setPlayIndex} />
      ) : (
        <LineGameSession
          key={playIndex}
          deck={deck}
          startIndex={playIndex}
          onBackToList={() => setPlayIndex(null)}
        />
      )}
    </div>
  )
}
