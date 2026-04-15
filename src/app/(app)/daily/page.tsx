'use client'
import { useState, useEffect, useRef, useMemo, type MouseEvent } from 'react'
import Link from 'next/link'
import { CalendarCheck, Calendar, Rocket, RotateCcw, ArrowRight, CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink, Star } from 'lucide-react'
import { getStudyPlan, saveStudyPlan, clearStudyPlan, getProgress, updateProgress, mergeRevisionClearedIds } from '@/lib/db'
import {
  computeTotalStudyDays,
  findFirstIncompleteStudyDay,
  getStudyDayContent,
  isDayComplete,
  type StudyPlanSlice,
} from '@/lib/dailySchedule'
import DifficultyBadge from '@/components/DifficultyBadge'
import toast from 'react-hot-toast'

interface Question {
  id: number
  title: string
  slug: string
  difficulty: string
  tags: string[]
}

interface ProgressData {
  solved: boolean
  starred: boolean
  notes: string
}

interface StudyPlan {
  start_date: string
  per_day: number
  question_order: number[]
  lock_code: string
  /** Cleared on a revision day — excluded from later 7th-day reviews */
  revision_cleared_ids?: number[]
}

function todayISO() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function planSlice(plan: StudyPlan): StudyPlanSlice {
  return { per_day: plan.per_day, question_order: plan.question_order }
}

function finishDateFromStudyDays(startDate: string, studyDayCount: number) {
  const d = new Date(startDate)
  d.setDate(d.getDate() + Math.max(0, studyDayCount - 1))
  return d.toISOString().split('T')[0]
}

/** Add calendar days to a YYYY-MM-DD string using America/Chicago (matches todayISO). */
function addDaysChicagoIso(iso: string, deltaDays: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const ms = Date.UTC(y, m - 1, d, 12, 0, 0) + deltaDays * 86400000
  return new Date(ms).toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })
}

/** Set plan start so that today counts as study day `targetDay` (1-based), capped at totalDays. */
function computeStartDateForTodayAsStudyDay(targetDay: number, totalDays: number): string {
  const t = Math.min(totalDays, Math.max(1, Math.floor(targetDay)))
  return addDaysChicagoIso(todayISO(), -(t - 1))
}

function getTodayInfo(
  plan: StudyPlan,
  allQuestions: Question[],
  progress: Record<string, ProgressData>
) {
  const today = todayISO()
  const start = new Date(plan.start_date)
  start.setHours(0, 0, 0, 0)
  const now = new Date(today)
  now.setHours(0, 0, 0, 0)

  const diffMs = now.getTime() - start.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  const slice = planSlice(plan)
  const totalDays = computeTotalStudyDays(slice)
  const finishDate = finishDateFromStudyDays(plan.start_date, totalDays || 1)
  const dueStudyDay = Math.min(totalDays, Math.max(1, diffDays + 1))

  if (diffDays < 0) {
    return {
      pending: true,
      daysUntil: -diffDays,
      startDate: plan.start_date,
      totalDays,
      finishDate,
      isRevisionDay: false,
    }
  }

  // Progression lock should require completing full revision day sets.
  const firstInc = findFirstIncompleteStudyDay(slice, progress, new Set())
  if (firstInc === -1) {
    return {
      complete: true,
      totalDays,
      finishDate,
      dayNumber: totalDays,
      daysLeft: 0,
      isRevisionDay: false,
    }
  }

  // Stack all unfinished due days up to today's scheduled study day.
  const stackedIds: number[] = []
  const seenIds = new Set<number>()
  const backlogDays: number[] = []
  for (let studyDay = 1; studyDay <= dueStudyDay; studyDay++) {
    const content = getStudyDayContent(slice, studyDay, new Set())
    if (!content.questionIds.length) continue
    if (isDayComplete(content.questionIds, progress)) continue
    backlogDays.push(studyDay)
    for (const id of content.questionIds) {
      if (!seenIds.has(id)) {
        seenIds.add(id)
        stackedIds.push(id)
      }
    }
  }

  const activeBacklogDay = backlogDays.length ? backlogDays[backlogDays.length - 1] : dueStudyDay
  const isRevisionDay = activeBacklogDay % 7 === 0
  const questionIds = stackedIds
  const questions = questionIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean) as Question[]
  const daysLeft = Math.max(0, totalDays - dueStudyDay)

  return {
    pending: false,
    complete: false,
    dayNumber: dueStudyDay,
    totalDays,
    finishDate,
    daysLeft,
    questionIds,
    questions,
    isRevisionDay,
  }
}

export default function DailyPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [progress, setProgress] = useState<Record<string, ProgressData>>({})
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)

  // Setup form
  const [startDate, setStartDate] = useState(todayISO())
  const [perDay, setPerDay] = useState(3)
  const [planCode, setPlanCode] = useState('')
  const [generating, setGenerating] = useState(false)

  // Reset gate
  const [showResetPrompt, setShowResetPrompt] = useState(false)
  const [resetAttempt, setResetAttempt] = useState('')
  const [resetError, setResetError] = useState(false)

  // Past days
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({})

  // Extra days
  const [extraDays, setExtraDays] = useState(0)

  // Align calendar day number (shift start_date only; progress unchanged)
  const [showAdjustSchedule, setShowAdjustSchedule] = useState(false)
  const [adjustTargetDay, setAdjustTargetDay] = useState('1')
  const [savingSchedule, setSavingSchedule] = useState(false)

  useEffect(() => {
    async function load() {
      const [qs, prog, p] = await Promise.all([
        fetch('/questions_full.json').then(r => r.json()),
        getProgress(),
        getStudyPlan(),
      ])
      setAllQuestions(qs)
      setProgress(prog)
      setPlan(p)
      setLoading(false)
    }
    load()
  }, [])

  const previewOrder = allQuestions.length ? generateOrder(allQuestions) : []
  const previewStudyDays = previewOrder.length
    ? computeTotalStudyDays({ per_day: perDay, question_order: previewOrder })
    : 0
  const previewFinish = finishDateFromStudyDays(startDate, previewStudyDays || 1)

  const revisionSolvedRef = useRef<Record<number, boolean | undefined>>({})

  const todayInfo = useMemo(() => {
    if (!plan || loading) return null
    return getTodayInfo(plan, allQuestions, progress)
  }, [plan, allQuestions, progress, loading])
  const totalDays = plan ? computeTotalStudyDays(planSlice(plan)) : 0
  const pastStudyDays = useMemo(() => {
    const days: number[] = []
    let d = (todayInfo?.dayNumber ?? totalDays) - 1
    while (d >= 1) {
      days.push(d)
      d = d % 7 === 0 ? d - 7 : d - 1
    }
    return days
  }, [todayInfo?.dayNumber, totalDays])

  useEffect(() => {
    revisionSolvedRef.current = {}
  }, [todayInfo?.dayNumber])

  useEffect(() => {
    if (!plan || !todayInfo || todayInfo.pending || todayInfo.complete || !todayInfo.isRevisionDay || !todayInfo.questionIds?.length)
      return
    for (const id of todayInfo.questionIds) {
      const now = !!progress[String(id)]?.solved
      const was = revisionSolvedRef.current[id]
      if (was !== undefined && now && !was) {
        mergeRevisionClearedIds([id]).then(merged => {
          if (merged) setPlan(prev => (prev ? { ...prev, revision_cleared_ids: merged } : null))
        })
      }
      revisionSolvedRef.current[id] = now
    }
  }, [progress, plan, todayInfo])

  function generateOrder(questions: Question[]): number[] {
    const easy   = questions.filter(q => q.difficulty === 'Easy').map(q => q.id)
    const medium = questions.filter(q => q.difficulty === 'Medium').map(q => q.id)
    const hard   = questions.filter(q => q.difficulty === 'Hard').map(q => q.id)
    return [...easy, ...medium, ...hard]
  }

  async function handleGenerate() {
    if (!planCode.trim()) return
    setGenerating(true)
    const order = generateOrder(allQuestions)
    const newPlan: StudyPlan = {
      start_date: startDate,
      per_day: perDay,
      question_order: order,
      lock_code: planCode.trim(),
      revision_cleared_ids: [],
    }
    const ok = await saveStudyPlan(newPlan)
    setGenerating(false)
    if (ok) {
      setPlan(newPlan)
      toast.success('Study plan created!')
    } else {
      toast.error('Failed to save plan — check Supabase RLS policies.')
    }
  }

  async function handleSaveAlignSchedule() {
    if (!plan || !totalDays) return
    const raw = parseInt(adjustTargetDay.trim(), 10)
    if (Number.isNaN(raw) || raw < 1) {
      toast.error('Enter a study day between 1 and your plan length.')
      return
    }
    const target = Math.min(totalDays, raw)
    setSavingSchedule(true)
    const newStart = computeStartDateForTodayAsStudyDay(target, totalDays)
    const updated: StudyPlan = { ...plan, start_date: newStart }
    const ok = await saveStudyPlan(updated)
    setSavingSchedule(false)
    if (ok) {
      setPlan(updated)
      setShowAdjustSchedule(false)
      toast.success(`Today is now study day ${target}. Solved progress is unchanged.`)
    } else {
      toast.error('Could not save — check Supabase.')
    }
  }

  async function handleResetConfirm() {
    if (!plan) return
    if (resetAttempt.trim() === plan.lock_code) {
      await clearStudyPlan()
      setPlan(null)
      setShowResetPrompt(false)
      toast.success('Plan reset!')
    } else {
      setResetError(true)
      setTimeout(() => setResetError(false), 2000)
    }
  }

  function getQById(id: number) {
    return allQuestions.find(q => q.id === id)
  }

  function isSolved(id: number) {
    return !!progress[String(id)]?.solved
  }

  function isStarred(id: number) {
    return !!progress[String(id)]?.starred
  }

  async function toggleStarred(e: MouseEvent<HTMLButtonElement>, questionId: number) {
    e.preventDefault()
    e.stopPropagation()
    const p = progress[String(questionId)] || { solved: false, starred: false, notes: '' }
    const newStarred = !p.starred
    setProgress(prev => ({ ...prev, [String(questionId)]: { ...p, starred: newStarred } }))
    await updateProgress(questionId, { starred: newStarred })
    toast.success(newStarred ? 'Starred — practice in LeetGame' : 'Removed star')
  }

  if (loading) return <div className="text-center py-32 text-gray-400 animate-pulse text-sm">Loading...</div>

  // SETUP VIEW
  if (!plan) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚔</div>
          <h1 className="text-2xl font-black text-gray-800 mb-1">LeetCode Police</h1>
          <p className="text-gray-500 text-sm">Daily Study Plan — commit to a schedule and stick to it.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-semibold text-gray-700">Total questions</span>
            <span className="text-2xl font-black text-indigo-600">{allQuestions.length}</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Questions per day</label>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 5, 7].map(n => (
                  <button
                    key={n}
                    onClick={() => setPerDay(n)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-colors ${
                      perDay === n ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={perDay}
                  onChange={e => setPerDay(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-2 py-1.5 border-2 border-gray-200 rounded-xl text-sm text-center focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start date</label>
              <input
                type="date"
                value={startDate}
                min={todayISO()}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Plan lock code</label>
              <input
                type="text"
                value={planCode}
                onChange={e => setPlanCode(e.target.value)}
                placeholder="e.g. grind2026"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
              />
              <p className="text-xs text-gray-400 mt-1">You need this code to reset the plan. Do not forget it.</p>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-indigo-600 font-semibold">Study sessions (incl. every 7th = revision)</span>
              <span className="text-lg font-black text-indigo-700">{previewStudyDays} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-indigo-500">Estimated finish</span>
              <span className="text-sm font-bold text-indigo-700">{fmtDate(previewFinish)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || !planCode.trim()}
          className="w-full py-4 bg-gray-900 text-white font-bold text-base rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Rocket size={18} />
          {generating ? 'Generating...' : !planCode.trim() ? 'Set a lock code to continue' : 'Generate & Lock My Plan'}
        </button>
      </div>
    )
  }

  // ACTIVE VIEW
  if (!todayInfo) return <div className="text-center py-32 text-gray-400 text-sm">Loading plan…</div>

  const progressPct = todayInfo.dayNumber ? Math.round((todayInfo.dayNumber / totalDays) * 100) : 0
  const todayQs = todayInfo.questions || []
  const todayDone = (todayInfo.questionIds || []).filter(id => isSolved(id)).length
  const pastDayCount = todayInfo.dayNumber ? todayInfo.dayNumber - 1 : totalDays
  const displayPast = pastDayCount

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">Study Plan</h1>
          {!todayInfo.pending && !todayInfo.complete && todayInfo.dayNumber && (
            <p className="text-xs text-gray-400 mt-0.5">
              Day {todayInfo.dayNumber} of {totalDays} · finish by {fmtDate(todayInfo.finishDate || '')}
            </p>
          )}
          {todayInfo.pending && (
            <p className="text-xs text-amber-500 mt-0.5">
              Starts in {todayInfo.daysUntil} day{todayInfo.daysUntil !== 1 ? 's' : ''} ({fmtDate(todayInfo.startDate || '')})
            </p>
          )}
          {todayInfo.complete && (
            <p className="text-xs text-green-600 font-semibold mt-0.5">Plan complete!</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!todayInfo.pending && !todayInfo.complete && todayInfo.dayNumber && (
            <button
              type="button"
              onClick={() => {
                setShowAdjustSchedule(s => !s)
                setAdjustTargetDay(String(todayInfo.dayNumber ?? 1))
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Calendar size={12} /> Align day
            </button>
          )}
          <button
            onClick={() => setShowResetPrompt(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Reset gate */}
      {showResetPrompt && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-bold text-red-700 mb-1">Enter your plan lock code to reset</p>
          <p className="text-xs text-red-500 mb-3">This will wipe the entire plan. Your solved progress is safe.</p>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              value={resetAttempt}
              onChange={e => { setResetAttempt(e.target.value); setResetError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleResetConfirm()}
              placeholder="Your lock code"
              autoFocus
              className={`px-3 py-2 rounded-lg border text-sm focus:outline-none transition-colors ${
                resetError ? 'border-red-500 bg-red-100' : 'border-gray-300 bg-white'
              }`}
            />
            <button onClick={handleResetConfirm} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors">
              Confirm Reset
            </button>
            <button onClick={() => setShowResetPrompt(false)} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            {resetError && <span className="text-red-600 text-xs font-semibold">Wrong code</span>}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {!todayInfo.pending && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
            <span>{todayInfo.complete ? 'Completed!' : `${todayInfo.dayNumber}/${totalDays} days`}</span>
            <span className="text-indigo-600">{progressPct}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{fmtDate(plan.start_date)}</span>
            <span>{todayInfo.daysLeft !== undefined ? `${todayInfo.daysLeft} days left` : ''}</span>
            <span>{fmtDate(todayInfo.finishDate || '')}</span>
          </div>
        </div>
      )}

      {/* Align today’s study day — shifts start_date only */}
      {showAdjustSchedule && !todayInfo.pending && !todayInfo.complete && todayInfo.dayNumber && (
        <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-indigo-900 mb-1">Align calendar day</p>
          <p className="text-xs text-indigo-700/90 mb-3">
            Set which study day &quot;today&quot; should be (uses Chicago date). Your solved questions and plan order stay the same — only the plan start date updates so tomorrow becomes the next day.
          </p>
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-indigo-600 mb-1">Today should be study day</label>
              <input
                type="number"
                min={1}
                max={totalDays}
                value={adjustTargetDay}
                onChange={e => setAdjustTargetDay(e.target.value)}
                className="w-24 px-2 py-2 border border-indigo-200 rounded-lg text-sm font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <span className="text-xs text-indigo-600 pb-2">of {totalDays}</span>
            <button
              type="button"
              disabled={savingSchedule}
              onClick={handleSaveAlignSchedule}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {savingSchedule ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setShowAdjustSchedule(false)}
              className="px-4 py-2 bg-white text-indigo-700 text-sm font-semibold rounded-lg border border-indigo-200 hover:bg-indigo-100/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TODAY'S QUESTIONS */}
      {!todayInfo.pending && !todayInfo.complete && todayInfo.dayNumber && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2 flex-wrap">
              <CalendarCheck size={15} className="text-indigo-500" />
              Today — Study day {todayInfo.dayNumber}
              {todayInfo.isRevisionDay && (
                <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Revision (7th day)
                </span>
              )}
            </h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              todayDone === todayQs.length ? 'bg-green-100 text-green-700' :
              todayDone > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>
              {todayDone}/{todayQs.length} done
            </span>
          </div>

          {todayInfo.isRevisionDay && (
            <p className="text-xs text-amber-800 bg-amber-50/80 border border-amber-100 rounded-lg px-3 py-2 mb-3">
              Review every problem from your <strong>previous six study days</strong>. Marking a problem solved here removes it from
              future revision days. New problems are paused today.
            </p>
          )}

          <div className="space-y-3">
            {todayQs.map(q => {
              const solved = isSolved(q.id)
              const starred = isStarred(q.id)
              return (
                <div
                  key={q.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    solved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 hover:border-indigo-200'
                  }`}
                >
                  <div className="shrink-0">
                    {solved ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400 font-mono">#{q.id}</span>
                      <span className={`text-sm font-semibold truncate ${solved ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                        {q.title}
                      </span>
                      {starred && <Star size={14} className="text-amber-500 shrink-0 fill-amber-400" aria-label="Starred for mastery" />}
                      <a
                        href={`https://leetcode.com/problems/${q.slug}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-gray-300 hover:text-orange-400 transition-colors"
                        title="Open on LeetCode"
                        onClick={e => e.stopPropagation()}
                      >
                        <ExternalLink size={11} />
                      </a>
                    </div>
                    <div className="mt-1">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={e => toggleStarred(e, q.id)}
                      title={starred ? 'Unstar (LeetGame mastery)' : 'Star — must master in LeetGame'}
                      className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors ${
                        starred
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-white text-gray-400 border-gray-200 hover:border-amber-300 hover:text-amber-600'
                      }`}
                    >
                      <Star size={16} className={starred ? 'fill-amber-400' : ''} />
                    </button>
                    <Link
                      href={`/practice/${q.id}?tab=solution#algorithm`}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-indigo-100 text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                    >
                      Approach
                    </Link>
                    <Link
                      href={`/practice/${q.id}`}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        solved
                          ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {solved ? <><RotateCcw size={11} /> Revisit</> : <>Solve <ArrowRight size={12} /></>}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {todayDone === todayQs.length && todayQs.length > 0 && (
            <div className="mt-4 text-center text-green-600 font-bold text-sm">
              All done for today! See you tomorrow.
            </div>
          )}

          {/* Sneak peek days */}
          {Array.from({ length: extraDays }, (_, i) => {
            const peekStudyDay = (todayInfo.dayNumber ?? 1) + 1 + i
            if (peekStudyDay > totalDays) return null
            const peekContent = getStudyDayContent(planSlice(plan), peekStudyDay, new Set())
            const nextIds = peekContent.questionIds
            const nextQs = nextIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean) as Question[]
            const alreadySolved = nextIds.filter(id => isSolved(id)).length
            const allPreSolved = nextQs.length === 0 || alreadySolved === nextQs.length
            return (
              <div key={peekStudyDay} className="mt-4 border-t border-dashed border-purple-100 pt-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-600 text-sm flex items-center gap-2 flex-wrap">
                    <span className="text-base">👀</span>
                    Study day {peekStudyDay}
                    {peekContent.isRevisionDay && (
                      <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Revision</span>
                    )}
                    <span className="text-xs font-normal text-purple-400">sneak peek</span>
                  </h3>
                  {alreadySolved > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      allPreSolved ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {alreadySolved}/{nextQs.length} pre-solved ✓
                    </span>
                  )}
                </div>

                {/* Hint */}
                <p className="text-xs text-gray-400 mb-3 italic">
                  Start learning now — these count on their allocated day, not today.
                </p>

                <div className="space-y-2">
                  {nextQs.map(q => {
                    const solved = isSolved(q.id)
                    const starred = isStarred(q.id)
                    return (
                      <div
                        key={q.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                          solved
                            ? 'bg-green-50 border-green-200'
                            : 'bg-purple-50/40 border-purple-100 hover:border-purple-200'
                        }`}
                      >
                        {/* Solved indicator */}
                        <div className="shrink-0">
                          {solved
                            ? <CheckCircle2 size={18} className="text-green-500" />
                            : <Circle size={18} className="text-purple-200" />}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-400 font-mono">#{q.id}</span>
                            <span className={`text-sm font-medium truncate ${solved ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                              {q.title}
                            </span>
                            {starred && <Star size={14} className="text-amber-500 shrink-0 fill-amber-400" aria-label="Starred for mastery" />}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <DifficultyBadge difficulty={q.difficulty} />
                            {solved && <span className="text-xs text-green-500 font-medium">already solved ✓</span>}
                          </div>
                        </div>

                        {/* Preview link — read-only intent, not solve pressure */}
                        <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
                          <button
                            type="button"
                            onClick={e => toggleStarred(e, q.id)}
                            title={starred ? 'Unstar (LeetGame mastery)' : 'Star — must master in LeetGame'}
                            className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors ${
                              starred
                                ? 'bg-amber-50 text-amber-600 border-amber-200'
                                : 'bg-white text-gray-400 border-gray-200 hover:border-amber-300 hover:text-amber-600'
                            }`}
                          >
                            <Star size={16} className={starred ? 'fill-amber-400' : ''} />
                          </button>
                          <Link
                            href={`/practice/${q.id}?tab=solution#algorithm`}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-indigo-100 text-indigo-600 bg-white hover:bg-indigo-50"
                          >
                            Approach
                          </Link>
                          <Link
                            href={`/practice/${q.id}`}
                            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                              solved
                                ? 'border-green-200 text-green-600 bg-green-50 hover:bg-green-100'
                                : 'border-purple-200 text-purple-600 bg-white hover:bg-purple-50'
                            }`}
                          >
                            {solved ? 'Review' : 'Preview'}
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Do More button — only unlocked when today is fully done */}
          {todayDone === todayQs.length &&
           (todayInfo.dayNumber ?? 1) + extraDays + 1 < totalDays && (
            <button
              onClick={() => setExtraDays(e => e + 1)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-purple-200 text-purple-600 text-sm font-semibold rounded-xl hover:bg-purple-50 transition-colors"
            >
              👀 Sneak peek tomorrow <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* PENDING */}
      {todayInfo.pending && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4 text-center">
          <div className="text-3xl mb-2">⏳</div>
          <p className="font-bold text-amber-800 text-sm">Plan starts on {fmtDate(todayInfo.startDate || '')}</p>
          <p className="text-xs text-amber-600 mt-1">Come back then and your questions will be waiting.</p>
        </div>
      )}

      {/* COMPLETE */}
      {todayInfo.complete && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4 text-center">
          <div className="text-4xl mb-2">🏆</div>
          <p className="font-bold text-green-800">You finished all {plan.question_order.length} questions!</p>
          <button
            onClick={async () => { await clearStudyPlan(); setPlan(null) }}
            className="mt-3 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors"
          >
            Start New Plan
          </button>
        </div>
      )}

      {/* PAST DAYS */}
      {displayPast > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-700 text-sm mb-3">Past Days</h2>
          <div className="space-y-2">
            {pastStudyDays.slice(0, displayPast).map(pastStudyDay => {
              const pastContent = getStudyDayContent(planSlice(plan), pastStudyDay, new Set())
              const questionIds = pastContent.questionIds
              const dayQs = questionIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean) as Question[]
              const doneCnt = questionIds.filter(id => isSolved(id)).length
              const expanded = expandedDays[pastStudyDay]
              return (
                <div key={pastStudyDay} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedDays(p => ({ ...p, [pastStudyDay]: !p[pastStudyDay] }))}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2 flex-wrap">
                      Study day {pastStudyDay}
                      {pastContent.isRevisionDay && (
                        <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">Revision</span>
                      )}
                      {pastContent.isRevisionDay && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          grouped days {pastStudyDay - 6}-{pastStudyDay - 1}
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${doneCnt === dayQs.length ? 'text-green-600' : doneCnt > 0 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {doneCnt}/{dayQs.length}
                      </span>
                      {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                  </button>
                  {expanded && (
                    <div className="px-4 pb-3 space-y-1.5 border-t border-gray-50">
                      {dayQs.map(q => (
                        <div key={q.id} className="flex items-center gap-2 text-sm py-1">
                          {isSolved(q.id)
                            ? <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                            : <Circle size={14} className="text-gray-300 shrink-0" />
                          }
                          <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
                            <Link href={`/practice/${q.id}`} className="truncate text-gray-700 hover:text-indigo-600">
                              {q.title}
                            </Link>
                            <Link
                              href={`/practice/${q.id}?tab=solution#algorithm`}
                              className="shrink-0 text-[10px] font-semibold text-indigo-500 hover:underline"
                            >
                              approach
                            </Link>
                          </div>
                          <a
                            href={`https://leetcode.com/problems/${q.slug}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-gray-300 hover:text-orange-400 transition-colors"
                            title="Open on LeetCode"
                          >
                            <ExternalLink size={11} />
                          </a>
                          <DifficultyBadge difficulty={q.difficulty} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
