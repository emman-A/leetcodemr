'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Star, CheckCircle2, Layers, BookOpen, CheckCircle } from 'lucide-react'
import { getProgress, updateProgress } from '@/lib/db'
import DifficultyBadge from '@/components/DifficultyBadge'
import toast from 'react-hot-toast'

interface Question {
  id: number
  title: string
  slug: string
  difficulty: string
  tags: string[]
  source: string[]
  python_solution?: string
  cpp_solution?: string
  description?: string
}

interface ProgressData {
  solved: boolean
  starred: boolean
  notes: string
  status?: string | null
  review_count?: number
  next_review?: string | null
}

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']
const SOURCES = ['All', 'Grind 169', 'Denny Zhang', 'Premium 98', 'CodeSignal']

export default function HomePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [progress, setProgress] = useState<Record<string, ProgressData>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [source, setSource] = useState('All')
  const [showStarred, setShowStarred] = useState(false)
  const [showSolved, setShowSolved] = useState<null | boolean>(null)

  useEffect(() => {
    async function load() {
      const [qs, prog] = await Promise.all([
        fetch('/questions_full.json').then(r => r.json()),
        getProgress(),
      ])
      setQuestions(qs)
      setProgress(prog)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = questions.filter(q => {
    if (difficulty !== 'All' && q.difficulty !== difficulty) return false
    if (source !== 'All' && !(q.source || []).includes(source)) return false
    if (search && !q.title.toLowerCase().includes(search.toLowerCase()) && !String(q.id).includes(search)) return false
    const p = progress[String(q.id)] || {}
    if (showStarred && !p.starred) return false
    if (showSolved === true && !p.solved) return false
    if (showSolved === false && p.solved) return false
    return true
  })

  const solved = Object.values(progress).filter(p => p.solved).length

  async function toggleSolved(e: React.MouseEvent, q: Question) {
    e.preventDefault()
    const p = progress[String(q.id)] || { solved: false, starred: false, notes: '' }
    const newSolved = !p.solved
    setProgress(prev => ({ ...prev, [String(q.id)]: { ...p, solved: newSolved } }))
    await updateProgress(q.id, { solved: newSolved })
    toast.success(newSolved ? 'Marked solved!' : 'Unmarked')
  }

  async function toggleStarred(e: React.MouseEvent, q: Question) {
    e.preventDefault()
    const p = progress[String(q.id)] || { solved: false, starred: false, notes: '' }
    const newStarred = !p.starred
    setProgress(prev => ({ ...prev, [String(q.id)]: { ...p, starred: newStarred } }))
    await updateProgress(q.id, { starred: newStarred })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-5 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <span className="text-sm font-bold text-gray-700">{solved} / {questions.length} solved</span>
        </div>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${questions.length ? Math.round((solved / questions.length) * 100) : 0}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-indigo-600">
          {questions.length ? Math.round((solved / questions.length) * 100) : 0}%
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Difficulty */}
          <div className="flex gap-1">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  difficulty === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Source */}
          <div className="flex flex-wrap gap-1">
            {SOURCES.map(s => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  source === s ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Starred */}
          <button
            onClick={() => setShowStarred(v => !v)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              showStarred ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Star size={12} /> Starred
          </button>

          {/* Solved toggle */}
          <button
            onClick={() => setShowSolved(v => v === null ? false : v === false ? true : null)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              showSolved === false ? 'bg-orange-400 text-white' :
              showSolved === true ? 'bg-green-500 text-white' :
              'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <CheckCircle2 size={12} />
            {showSolved === false ? 'Unsolved' : showSolved === true ? 'Solved' : 'All'}
          </button>

          <span className="ml-auto text-xs text-gray-400">{filtered.length} questions</span>
        </div>

        {/* Shortcut links */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          <Link
            href="/flashcards"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            <Layers size={12} /> Flashcards
          </Link>
        </div>
      </div>

      {/* Questions grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm animate-pulse">Loading questions...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(q => {
            const p = progress[String(q.id)] || { solved: false, starred: false, notes: '' }
            return (
              <div
                key={q.id}
                className={`group rounded-xl border p-4 transition-all duration-150 hover:shadow-md hover:border-indigo-300 ${
                  p.solved ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/question/${q.id}`} className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xs text-gray-400 font-mono shrink-0">#{q.id}</span>
                    <h3 className="font-semibold text-gray-800 text-sm truncate group-hover:text-indigo-600 transition-colors">
                      {q.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={e => toggleStarred(e, q)}>
                      <Star
                        size={14}
                        className={p.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-400'}
                      />
                    </button>
                    <button onClick={e => toggleSolved(e, q)}>
                      <CheckCircle2
                        size={14}
                        className={p.solved ? 'text-green-500 fill-green-500' : 'text-gray-300 hover:text-green-400'}
                      />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <DifficultyBadge difficulty={q.difficulty} />
                  {(q.tags || []).slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {q.python_solution && (
                    <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">Py</span>
                  )}
                </div>

                {/* Source tags */}
                {(q.source || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(q.source || []).map(s => (
                      <span key={s} className="text-xs bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Notes preview */}
                {p.notes && (
                  <p className="text-xs text-gray-400 mt-2 italic truncate">📝 {p.notes}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
