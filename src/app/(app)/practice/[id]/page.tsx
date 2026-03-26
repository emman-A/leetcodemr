'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Clock, Code2, ChevronDown, ChevronUp, BookOpen, ExternalLink } from 'lucide-react'
import { getProgress, updateProgress, addTimeSpent } from '@/lib/db'
import { formatTime } from '@/lib/utils'
import DifficultyBadge from '@/components/DifficultyBadge'
import CodePanel from '@/components/CodePanel'
import LeetCodeEditor from '@/components/LeetCodeEditor'
import DescriptionRenderer from '@/components/DescriptionRenderer'
import toast from 'react-hot-toast'

interface Question {
  id: number
  title: string
  slug: string
  difficulty: string
  tags: string[]
  source: string[]
  description?: string
  explanation?: string
  doocs_url?: string
  python_solution?: string
  cpp_solution?: string
  starter_python?: string
  starter_cpp?: string
}

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [solved, setSolved] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [leftTab, setLeftTab] = useState<'description' | 'solution'>('description')
  const [timer, setTimer] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef(Date.now())

  useEffect(() => {
    async function load() {
      const [qs, prog] = await Promise.all([
        fetch('/questions_full.json').then(r => r.json()),
        getProgress(),
      ])
      const q = (qs as Question[]).find((q: Question) => q.id === id)
      if (!q) { setLoading(false); return }
      setQuestion(q)
      const p = prog[String(id)] || {}
      setSolved(!!p.solved)
      setLoading(false)
    }
    load()
  }, [id])

  // Timer — track time spent on question
  useEffect(() => {
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    startRef.current = Date.now()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      const elapsed = Math.round((Date.now() - startRef.current) / 1000)
      if (elapsed > 5) addTimeSpent(id, elapsed)
    }
  }, [id])

  async function handleMarkSolved() {
    const newSolved = !solved
    setSolved(newSolved)
    await updateProgress(id, { solved: newSolved })
    toast.success(newSolved ? 'Marked as solved! 🎉' : 'Unmarked')
  }

  if (loading) return <div className="text-center py-32 text-gray-400 animate-pulse text-sm">Loading...</div>
  if (!question) return <div className="text-center py-32 text-red-400 text-sm">Question not found.</div>

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-white shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-700 transition-colors shrink-0">
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs text-gray-400 font-mono shrink-0">#{question.id}</span>
          <h1 className="font-bold text-gray-800 text-sm leading-snug truncate">{question.title}</h1>
          <DifficultyBadge difficulty={question.difficulty} />
          <a
            href={`https://leetcode.com/problems/${question.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-gray-300 hover:text-orange-400 transition-colors"
            title="Open on LeetCode"
          >
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-mono font-semibold text-gray-600">
            <Clock size={13} />
            {formatTime(timer)}
          </div>
          <button
            onClick={handleMarkSolved}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${
              solved
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-green-300'
            }`}
          >
            <CheckCircle size={13} className={solved ? 'fill-green-500 text-white' : ''} />
            {solved ? 'Solved ✓' : 'Mark Solved'}
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden gap-0">

        {/* LEFT — Question info */}
        <div className="w-[42%] shrink-0 flex flex-col border-r border-gray-100 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 bg-white shrink-0">
            <button
              onClick={() => setLeftTab('description')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                leftTab === 'description'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <BookOpen size={12} /> Description
            </button>
            {(question.python_solution || question.cpp_solution) && (
              <button
                onClick={() => setLeftTab('solution')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  leftTab === 'solution'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Code2 size={12} /> Solution
              </button>
            )}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            {leftTab === 'description' && (
              <div>
                {/* Tags */}
                {(question.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {question.tags.map(t => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {question.description ? (
                  <DescriptionRenderer description={question.description} />
                ) : (
                  <div className="text-sm text-gray-400 italic">
                    No description available.{' '}
                    <a
                      href={`https://leetcode.com/problems/${question.slug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:underline"
                    >
                      View on LeetCode ↗
                    </a>
                  </div>
                )}

                {/* Explanation */}
                {question.explanation && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Explanation</p>
                    <DescriptionRenderer explanation={question.explanation} />
                  </div>
                )}

                {/* Source companies */}
                {(question.source || []).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Asked by</p>
                    <div className="flex flex-wrap gap-1.5">
                      {question.source.map(s => (
                        <span key={s} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {leftTab === 'solution' && (
              <CodePanel pythonCode={question.python_solution} cppCode={question.cpp_solution} />
            )}
          </div>
        </div>

        {/* RIGHT — Code editor + tests */}
        <div className="flex-1 overflow-y-auto">
          <LeetCodeEditor appQuestionId={question.id} slug={question.slug} />
        </div>
      </div>
    </div>
  )
}
