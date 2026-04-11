'use client'
import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Layers, CheckCircle, Circle, Search, X } from 'lucide-react'
import { getFcVisited, addFcVisited } from '@/lib/db'
import { shuffle } from '@/lib/utils'
import { DIFFICULTY_LEVELS, QUESTION_SOURCES, QUICK_PATTERNS } from '@/lib/constants'
import DifficultyBadge from '@/components/DifficultyBadge'
import CodePanel from '@/components/CodePanel'

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

function buildFlashcardParams(opts: {
  diff: string
  source: string
  search: string
  starred: boolean
  solved: null | boolean
  pattern: string | null
}): string {
  const p = new URLSearchParams()
  if (opts.diff !== 'All') p.set('diff', opts.diff)
  if (opts.source !== 'All') p.set('source', opts.source)
  if (opts.search.trim()) p.set('search', opts.search.trim())
  if (opts.starred) p.set('starred', '1')
  if (opts.solved === true) p.set('solved', 'true')
  if (opts.solved === false) p.set('solved', 'false')
  if (opts.pattern) {
    const pat = QUICK_PATTERNS.find(x => x.name === opts.pattern)
    if (pat?.tags?.length) p.set('tags', [...pat.tags].join(','))
  }
  return p.toString()
}

function questionMatchesSearch(q: Question, query: string): boolean {
  const t = query.trim().toLowerCase()
  if (!t) return true
  if (q.title.toLowerCase().includes(t)) return true
  if (q.slug?.toLowerCase().includes(t)) return true
  if (String(q.id) === t) return true
  return (q.tags || []).some(tag => tag.toLowerCase().includes(t))
}

function FlashcardsInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initDiff    = searchParams.get('diff')    || 'All'
  const initSource  = searchParams.get('source')  || 'All'
  const initSearch  = searchParams.get('search')  || ''
  const initStarred = searchParams.get('starred') === '1'
  const initTagsRaw = searchParams.get('tags')    || ''
  const initTags    = initTagsRaw ? initTagsRaw.split(',') : []
  const initSolvedParam = searchParams.get('solved')
  const initSolved: null | boolean = initSolvedParam === 'true' ? true : initSolvedParam === 'false' ? false : null

  const [all, setAll] = useState<Question[]>([])
  const [progress, setProgress] = useState<Record<number, { solved?: boolean; starred?: boolean }>>({})
  const [deck, setDeck] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [fading, setFading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterDiff, setFilterDiff] = useState(initDiff)
  const [filterSource, setFilterSource] = useState(initSource)
  const [filterPattern, setFilterPattern] = useState<string | null>(
    initTags.length > 0 ? (QUICK_PATTERNS.find(p => p.tags.some(t => initTags.includes(t)))?.name ?? null) : null
  )
  const [searchQuery, setSearchQuery] = useState(initSearch)
  const [filterStarred, setFilterStarred] = useState(initStarred)
  const [filterSolved, setFilterSolved] = useState<null | boolean>(initSolved)
  const [isShuffled, setIsShuffled] = useState(false)
  const [visited, setVisited] = useState<Set<number>>(new Set())
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchQueryRef = useRef(searchQuery)
  searchQueryRef.current = searchQuery

  const replaceFlashcardUrl = useCallback(
    (search: string) => {
      const qs = buildFlashcardParams({
        diff: filterDiff,
        source: filterSource,
        search,
        starred: filterStarred,
        solved: filterSolved,
        pattern: filterPattern,
      })
      const next = qs ? `${pathname}?${qs}` : pathname
      router.replace(next, { scroll: false })
    },
    [pathname, router, filterDiff, filterSource, filterStarred, filterSolved, filterPattern]
  )

  // Debounce writing ?search= to the URL while typing (deck filters use searchQuery state immediately).
  useEffect(() => {
    const id = window.setTimeout(() => {
      const fromUrl = searchParams.get('search') || ''
      if (searchQuery.trim() === fromUrl.trim()) return
      replaceFlashcardUrl(searchQuery)
    }, 350)
    return () => window.clearTimeout(id)
  }, [searchQuery, replaceFlashcardUrl, searchParams])

  // When difficulty / source / pattern / starred / solved change, update URL immediately (keep current search text).
  useEffect(() => {
    replaceFlashcardUrl(searchQueryRef.current)
  }, [filterDiff, filterSource, filterPattern, filterStarred, filterSolved, replaceFlashcardUrl])

  useEffect(() => {
    async function load() {
      const [qs, vis, prog] = await Promise.all([
        fetch('/questions_full.json').then(r => r.json()),
        getFcVisited(),
        import('@/lib/db').then(m => m.getProgress()),
      ])
      setAll(qs)
      setProgress(prog)
      setVisited(vis)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let filtered = all
    if (filterDiff !== 'All') filtered = filtered.filter(q => q.difficulty === filterDiff)
    if (filterSource !== 'All') filtered = filtered.filter(q => (q.source || []).includes(filterSource))
    filtered = filtered.filter(q => questionMatchesSearch(q, searchQuery))
    if (filterPattern) {
      const patTags = QUICK_PATTERNS.find(p => p.name === filterPattern)?.tags ?? []
      filtered = filtered.filter(q => (q.tags || []).some(t => (patTags as readonly string[]).includes(t)))
    }
    if (filterStarred) filtered = filtered.filter(q => progress[q.id]?.starred)
    if (filterSolved === true) filtered = filtered.filter(q => progress[q.id]?.solved)
    if (filterSolved === false) filtered = filtered.filter(q => !progress[q.id]?.solved)
    setDeck(isShuffled ? shuffle(filtered) : filtered)
    setIdx(0)
    setFlipped(false)
  }, [
    filterDiff,
    filterSource,
    filterPattern,
    filterStarred,
    filterSolved,
    searchQuery,
    all,
    isShuffled,
    progress,
  ])

  const q = deck[idx] || null

  const fadeSwap = useCallback((fn: () => void) => {
    setFading(true)
    setTimeout(() => { fn(); setFading(false) }, 180)
  }, [])

  const handleFlip = useCallback(() => {
    if (!q) return
    fadeSwap(() => {
      const nowFlipping = !flipped
      setFlipped(nowFlipping)
      if (nowFlipping && !visited.has(q.id)) {
        const next = new Set(visited)
        next.add(q.id)
        setVisited(next)
        addFcVisited(q.id)
      }
    })
  }, [q, flipped, fadeSwap, visited])

  const go = useCallback((dir: number) => {
    fadeSwap(() => {
      setFlipped(false)
      setIdx(i => Math.max(0, Math.min(deck.length - 1, i + dir)))
    })
  }, [deck.length, fadeSwap])

  const reset = () => fadeSwap(() => { setIdx(0); setFlipped(false) })

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleFlip() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, handleFlip])

  if (loading) return <div className="text-center py-32 text-gray-400 animate-pulse text-sm">Loading flashcards...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Layers className="text-indigo-500" /> Flashcards
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Tap card to flip · ← → to navigate · Space to flip · search filters the deck as you type
            </p>
          </div>
        </div>
        {/* Search */}
        <div className="mb-4 flex flex-wrap items-stretch gap-2">
          <div className="relative flex-1 min-w-[min(100%,220px)] max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400" size={16} aria-hidden />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search title, #id, slug, tag…"
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              autoComplete="off"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  replaceFlashcardUrl('')
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => searchInputRef.current?.focus()}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
          >
            <Search size={14} /> Search
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
          <span className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-full">
            {deck.length === 0 ? '0 / 0' : `${idx + 1} / ${deck.length}`}
          </span>
          <span className="bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-full flex items-center gap-1">
            <CheckCircle size={11} /> {visited.size} visited
          </span>
          <button
            onClick={() => setIsShuffled(s => !s)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors ${
              isShuffled ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
            }`}
          >
            <Shuffle size={12} /> Shuffle
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border bg-white text-gray-500 border-gray-200 hover:border-gray-400 transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 space-y-2">
        {/* Difficulty + Source */}
        <div className="flex flex-wrap gap-2">
          {DIFFICULTY_LEVELS.map(d => (
            <button key={d} onClick={() => setFilterDiff(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors shrink-0 ${
                filterDiff === d ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
              }`}>
              {d}
            </button>
          ))}
          <span className="w-px bg-gray-200 shrink-0" />
          {QUESTION_SOURCES.map(s => (
            <button key={s.value} onClick={() => setFilterSource(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors shrink-0 ${
                filterSource === s.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Pattern filter */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterPattern(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors shrink-0 ${
              !filterPattern ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-500 border-gray-200 hover:border-cyan-300'
            }`}>
            All Patterns
          </button>
          {QUICK_PATTERNS.map(p => (
            <button key={p.name} onClick={() => setFilterPattern(filterPattern === p.name ? null : p.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors shrink-0 ${
                filterPattern === p.name ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-500 border-gray-200 hover:border-cyan-300'
              }`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {deck.length === 0 && (
        <div className="text-center py-20 text-gray-400 text-sm">No questions match this filter.</div>
      )}

      {q && (
        <>
          {/* Card */}
          <div
            onClick={handleFlip}
            className="cursor-pointer select-none"
            style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.18s ease' }}
          >
            {!flipped ? (
              /* FRONT */
              <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 px-5 pt-4 pb-2 border-b border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">#{q.id}</span>
                    <DifficultyBadge difficulty={q.difficulty} />
                    {(q.source || []).map(s => (
                      <span key={s} className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-100">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        const next = new Set(visited)
                        if (next.has(q.id)) { next.delete(q.id) } else { next.add(q.id); addFcVisited(q.id) }
                        setVisited(next)
                      }}
                      className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                        visited.has(q.id) ? 'bg-green-50 text-green-600 border-green-300' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-green-300 hover:text-green-500'
                      }`}
                    >
                      {visited.has(q.id) ? <><CheckCircle size={11} /> Visited</> : <><Circle size={11} /> Mark visited</>}
                    </button>
                    <span className="hidden sm:inline text-xs text-gray-300 font-medium">Tap to reveal →</span>
                  </div>
                </div>

                <div className="px-5 py-3">
                  <h2 className="text-lg font-bold text-gray-800">{q.title}</h2>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(q.tags || []).map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <img
                    src={`/question-images/${q.id}.jpg`}
                    alt={q.title}
                    className="w-full rounded-lg"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              </div>
            ) : (
              /* BACK */
              <div className="bg-white rounded-2xl border border-indigo-200 shadow-md overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 px-5 pt-4 pb-2 border-b border-indigo-100 bg-indigo-50">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="text-xs text-gray-400 font-mono">#{q.id}</span>
                    <DifficultyBadge difficulty={q.difficulty} />
                    <span className="text-sm font-bold text-indigo-700 truncate">{q.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={e => { e.stopPropagation() }}
                      className="text-xs text-indigo-400 font-medium"
                    >
                      ← Flip back
                    </button>
                  </div>
                </div>

                <div className="p-4" onClick={e => e.stopPropagation()}>
                  <CodePanel pythonCode={q.python_solution} cppCode={q.cpp_solution} />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-5">
            <button
              onClick={() => go(-1)}
              disabled={idx === 0}
              className="flex items-center gap-1 px-3 sm:px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[160px] sm:max-w-none">
              {deck.length <= 15 ? (
                deck.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setIdx(i); setFlipped(false) }}
                    className={`rounded-full transition-all ${
                      i === idx ? 'w-3 h-3 bg-indigo-500' : 'w-2 h-2 bg-gray-200 hover:bg-gray-400'
                    }`}
                  />
                ))
              ) : (
                <span className="text-xs text-gray-400 font-mono">{idx + 1} / {deck.length}</span>
              )}
            </div>

            <button
              onClick={() => go(1)}
              disabled={idx === deck.length - 1}
              className="flex items-center gap-1 px-3 sm:px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="text-center py-32 text-gray-400 animate-pulse text-sm">Loading flashcards...</div>}>
      <FlashcardsInner />
    </Suspense>
  )
}
