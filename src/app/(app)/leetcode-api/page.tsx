'use client'
import { useState } from 'react'
import {
  Search, Trophy, Target, Calendar, ExternalLink,
  CheckCircle, XCircle, Loader2, User, Tag, BarChart2,
} from 'lucide-react'

/* ─── Types ─────────────────────────────────────────────── */
interface DailyChallenge {
  date: string
  link: string
  question: {
    questionId: string
    title: string
    titleSlug: string
    difficulty: string
    topicTags: { name: string }[]
  }
}

interface AcStat {
  difficulty: string
  count: number
  submissions: number
}

interface UserProfile {
  username: string
  profile: {
    realName: string
    ranking: number
    userAvatar: string
    reputation: number
  }
  submitStatsGlobal: {
    acSubmissionNum: AcStat[]
  }
}

/* ─── GraphQL queries ────────────────────────────────────── */
const DAILY_QUERY = `
  query getDailyChallenge {
    activeDailyCodingChallengeQuestion {
      date
      link
      question {
        questionId
        title
        titleSlug
        difficulty
        topicTags { name }
      }
    }
  }
`

const USER_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        ranking
        userAvatar
        reputation
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
  }
`

/* ─── Helper ─────────────────────────────────────────────── */
async function gql(query: string, variables?: Record<string, unknown>) {
  const res = await fetch('/api/leetcode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error')
  return json.data
}

const diffColor: Record<string, string> = {
  Easy:   'text-green-600 bg-green-50 border-green-200',
  Medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  Hard:   'text-red-600 bg-red-50 border-red-200',
}

/* ─── Page ───────────────────────────────────────────────── */
export default function LeetCodeApiPage() {
  const [daily, setDaily]         = useState<DailyChallenge | null>(null)
  const [dailyLoading, setDL]     = useState(false)
  const [dailyErr, setDE]         = useState('')

  const [username, setUsername]   = useState('')
  const [profile, setProfile]     = useState<UserProfile | null>(null)
  const [profileLoading, setPL]   = useState(false)
  const [profileErr, setPE]       = useState('')

  /* Fetch daily challenge */
  const fetchDaily = async () => {
    setDL(true); setDE('')
    try {
      const data = await gql(DAILY_QUERY)
      setDaily(data.activeDailyCodingChallengeQuestion)
    } catch (e) {
      setDE(String(e))
    } finally {
      setDL(false)
    }
  }

  /* Fetch user profile */
  const fetchProfile = async () => {
    if (!username.trim()) return
    setPL(true); setPE(''); setProfile(null)
    try {
      const data = await gql(USER_QUERY, { username: username.trim() })
      if (!data.matchedUser) throw new Error('User not found')
      setProfile(data.matchedUser)
    } catch (e) {
      setPE(String(e))
    } finally {
      setPL(false)
    }
  }

  const acStats = profile?.submitStatsGlobal.acSubmissionNum ?? []
  const totalAC = acStats.find(s => s.difficulty === 'All')
  const easyAC  = acStats.find(s => s.difficulty === 'Easy')
  const medAC   = acStats.find(s => s.difficulty === 'Medium')
  const hardAC  = acStats.find(s => s.difficulty === 'Hard')

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <BarChart2 className="text-indigo-500" size={24} />
          LeetCode API Explorer
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Hitting LeetCode&apos;s internal GraphQL API via a server-side proxy — no CORS issues.
        </p>
      </div>

      {/* ── Daily Challenge ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={16} className="text-orange-500" /> Today&apos;s Daily Challenge
          </h2>
          <button
            onClick={fetchDaily}
            disabled={dailyLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {dailyLoading ? <Loader2 size={14} className="animate-spin" /> : <Target size={14} />}
            {dailyLoading ? 'Fetching…' : 'Fetch'}
          </button>
        </div>

        {dailyErr && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg p-3">
            <XCircle size={14} /> {dailyErr}
          </div>
        )}

        {daily && (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{daily.date}</p>
                <p className="font-semibold text-gray-900">{daily.question.questionId}. {daily.question.title}</p>
              </div>
              <a
                href={`https://leetcode.com${daily.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
              >
                Open <ExternalLink size={11} />
              </a>
            </div>

            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${diffColor[daily.question.difficulty] ?? ''}`}>
              {daily.question.difficulty}
            </span>

            {daily.question.topicTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {daily.question.topicTags.map(t => (
                  <span key={t.name} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    <Tag size={10} /> {t.name}
                  </span>
                ))}
              </div>
            )}

            <div className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle size={13} /> API call successful
            </div>
          </div>
        )}

        {!daily && !dailyErr && !dailyLoading && (
          <p className="text-sm text-gray-400">Press Fetch to load today&apos;s challenge from LeetCode.</p>
        )}
      </section>

      {/* ── User Profile ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <User size={16} className="text-indigo-500" /> User Profile Lookup
        </h2>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchProfile()}
              placeholder="LeetCode username…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <button
            onClick={fetchProfile}
            disabled={profileLoading || !username.trim()}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {profileLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {profileLoading ? 'Loading…' : 'Look up'}
          </button>
        </div>

        {profileErr && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg p-3">
            <XCircle size={14} /> {profileErr}
          </div>
        )}

        {profile && (
          <div className="space-y-4">
            {/* Avatar + name */}
            <div className="flex items-center gap-3">
              {profile.profile.userAvatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.profile.userAvatar} alt={profile.username} className="w-12 h-12 rounded-full border border-gray-200" />
              )}
              <div>
                <p className="font-bold text-gray-900">{profile.profile.realName || profile.username}</p>
                <p className="text-xs text-gray-500">@{profile.username}</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-sm font-semibold text-yellow-600">
                <Trophy size={14} /> Rank #{profile.profile.ranking.toLocaleString()}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Total AC',  value: totalAC?.count ?? 0, color: 'text-gray-800' },
                { label: 'Easy',      value: easyAC?.count  ?? 0, color: 'text-green-600' },
                { label: 'Medium',    value: medAC?.count   ?? 0, color: 'text-yellow-600' },
                { label: 'Hard',      value: hardAC?.count  ?? 0, color: 'text-red-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-black ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle size={13} /> API call successful
            </div>
          </div>
        )}

        {!profile && !profileErr && !profileLoading && (
          <p className="text-sm text-gray-400">Enter a LeetCode username and press Look up.</p>
        )}
      </section>

      {/* Note */}
      <p className="text-xs text-gray-400 text-center">
        Uses LeetCode&apos;s internal GraphQL API (unofficial). Public data only — no auth required for daily challenge or public profiles.
      </p>
    </div>
  )
}
