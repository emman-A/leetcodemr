'use client'
import { useState, useEffect, useRef } from 'react'
import { Trophy, TrendingUp, Download, Upload, CheckCircle, AlertTriangle } from 'lucide-react'
import { getProgress, getSolvedLog, getTimeTracking } from '@/lib/db'
import DifficultyBadge from '@/components/DifficultyBadge'
import toast from 'react-hot-toast'

interface Question {
  id: number
  title: string
  difficulty: string
}

interface ProgressData {
  solved: boolean
  starred: boolean
  notes: string
}

function ActivityHeatmap({ log }: { log: Record<string, number> }) {
  const weeks = 52
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build 52 weeks of dates (364 days back)
  const cells: { date: string; count: number }[] = []
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]
    cells.push({ date: iso, count: log[iso] || 0 })
  }

  function getColor(count: number) {
    if (count === 0) return 'bg-gray-100'
    if (count === 1) return 'bg-green-200'
    if (count === 2) return 'bg-green-400'
    if (count <= 4) return 'bg-green-500'
    return 'bg-green-700'
  }

  // Group into weeks (columns of 7)
  const weekGroups: { date: string; count: number }[][] = []
  for (let w = 0; w < weeks; w++) {
    weekGroups.push(cells.slice(w * 7, (w + 1) * 7))
  }

  return (
    <div className="flex gap-0.5 overflow-x-auto pb-2">
      {weekGroups.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-0.5">
          {week.map(({ date, count }) => (
            <div
              key={date}
              title={`${date}: ${count} solved`}
              className={`w-3 h-3 rounded-sm ${getColor(count)}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function StatsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [progress, setProgress] = useState<Record<string, ProgressData>>({})
  const [solvedLog, setSolvedLog] = useState<Record<string, number>>({})
  const [timeData, setTimeData] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [importStatus, setImportStatus] = useState<'ok' | 'err' | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      const [qs, prog, sl, td] = await Promise.all([
        fetch('/questions_full.json').then(r => r.json()),
        getProgress(),
        getSolvedLog(),
        getTimeTracking(),
      ])
      setQuestions(qs)
      setProgress(prog)
      setSolvedLog(sl)
      setTimeData(td)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-center py-32 text-gray-400 animate-pulse text-sm">Loading...</div>

  // Compute stats
  const totalQ = questions.length
  const solvedQ = Object.values(progress).filter(p => p.solved).length
  const starredQ = Object.values(progress).filter(p => p.starred).length
  const percent = totalQ ? Math.round((solvedQ / totalQ) * 100) : 0

  const byDiff: Record<string, { total: number; solved: number }> = {}
  for (const q of questions) {
    if (!byDiff[q.difficulty]) byDiff[q.difficulty] = { total: 0, solved: 0 }
    byDiff[q.difficulty].total++
    if (progress[String(q.id)]?.solved) byDiff[q.difficulty].solved++
  }

  const solvedQuestions = questions.filter(q => progress[String(q.id)]?.solved).slice(0, 10)
  const totalTimeSeconds = Object.values(timeData).reduce((a, b) => a + b, 0)

  // Export
  function exportData() {
    const backup = {
      version: 1,
      exported: new Date().toISOString(),
      progress,
      solvedLog,
      timeData,
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leetmastery-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Backup exported!')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" /> Your Stats
      </h1>

      {/* Big number cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Solved', value: solvedQ, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          { label: 'Total', value: totalQ, color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200' },
          { label: 'Starred', value: starredQ, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
        ].map(c => (
          <div key={c.label} className={`rounded-xl border p-3 sm:p-5 text-center ${c.bg}`}>
            <div className={`text-3xl sm:text-4xl font-black ${c.color}`}>{c.value}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
          <span>Overall Progress</span>
          <span className="text-indigo-600">{percent}%</span>
        </div>
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* By difficulty */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
          <TrendingUp size={15} /> By Difficulty
        </h2>
        <div className="space-y-3">
          {Object.entries(byDiff).map(([diff, data]) => {
            const pct = data.total ? Math.round((data.solved / data.total) * 100) : 0
            return (
              <div key={diff}>
                <div className="flex items-center justify-between mb-1">
                  <DifficultyBadge difficulty={diff} />
                  <span className="text-xs text-gray-500">{data.solved} / {data.total}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      diff === 'Easy' ? 'bg-green-400' : diff === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Solved questions list */}
      {solvedQuestions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 className="font-bold text-gray-700 text-sm mb-3">Solved Questions</h2>
          <div className="space-y-2">
            {solvedQuestions.map(q => (
              <div key={q.id} className="flex items-center justify-between gap-2 text-sm min-w-0">
                <span className="text-gray-700 truncate min-w-0">
                  <span className="text-gray-400 font-mono text-xs mr-2">#{q.id}</span>
                  {q.title}
                </span>
                <div className="shrink-0">
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Heatmap */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-gray-700 text-sm mb-4">Activity Heatmap (52 weeks)</h2>
        <div className="overflow-x-auto">
          <ActivityHeatmap log={solvedLog} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Each cell = one day · darker = more solved</p>
      </div>

      {/* Time Spent */}
      {totalTimeSeconds > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 className="font-bold text-gray-700 text-sm mb-3">Time Spent</h2>
          <div className="text-3xl font-black text-indigo-600 mb-1">
            {Math.round(totalTimeSeconds / 60)}m
          </div>
          <p className="text-xs text-gray-400">total practice time across {Object.keys(timeData).length} questions</p>
        </div>
      )}

      {/* Backup & Restore */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-700 text-sm mb-1">Backup & Restore</h2>
        <p className="text-xs text-gray-400 mb-4">
          Export your progress data to keep it safe or transfer to another device.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Download size={15} /> Export backup
          </button>
        </div>

        {importStatus === 'ok' && (
          <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-semibold">
            <CheckCircle size={15} /> Exported successfully!
          </div>
        )}
        {importStatus === 'err' && (
          <div className="mt-3 flex items-center gap-2 text-red-500 text-sm font-semibold">
            <AlertTriangle size={15} /> Export failed.
          </div>
        )}

        <input ref={fileRef} type="file" accept=".json" className="hidden" />
      </div>
    </div>
  )
}
