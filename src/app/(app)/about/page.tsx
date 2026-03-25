'use client'
import {
  BookOpen, CheckCircle, Layers, BarChart2, MessageSquare, Gem,
  Server, Calendar, Code2, Brain, Zap, Timer, Map, GraduationCap, BookMarked,
} from 'lucide-react'

const FEATURES = [
  {
    icon: CheckCircle,
    color: 'text-green-500',
    label: 'Questions Library',
    desc: '331 LeetCode questions with Python & C++ solutions, difficulty badges, and source tags (Grind 169, Denny Zhang, Premium 98, CodeSignal). Filter by difficulty, source, starred, or solved status. Study filtered sets as Flashcards or in Learn mode.',
  },
  {
    icon: Layers,
    color: 'text-indigo-500',
    label: 'Flashcard Mode',
    desc: 'Study questions as flashcards. Flip to reveal the solution. Filter by difficulty, source, starred or solved status — filters carry over from the home page. Keyboard navigation and shuffle support.',
  },
  {
    icon: GraduationCap,
    color: 'text-violet-500',
    label: 'Learn Mode',
    desc: 'Work through questions one-by-one in a focused reading view. Shows description, solution code, and notes. Carries the same filter state from the home page so you study exactly the set you chose.',
  },
  {
    icon: Map,
    color: 'text-cyan-500',
    label: 'Patterns',
    desc: 'Study by algorithm pattern — Arrays & Hashing, Two Pointers, Sliding Window, Trees, Graphs, DP, and more. Each pattern opens a flashcard deck or list view. Progress bar per pattern. Solved and visited tracking.',
  },
  {
    icon: Code2,
    color: 'text-blue-500',
    label: 'Practice Editor',
    desc: 'Write and run Python or C++ code directly in the browser using the Judge0 API (proxied server-side). Auto-generates a test harness from the solution signature. Auto-saves code per question and language. Link to the original LeetCode problem for reference.',
  },
  {
    icon: BookMarked,
    color: 'text-emerald-500',
    label: 'DSA Templates & Tutorials',
    desc: 'Two-tab reference library. Templates: code snippets for common patterns (binary search, BFS/DFS, sliding window, union-find, etc.) in Python and C++. Tutorials: algorithm explanations with complexity analysis and highlighted code (Arrays, Sorting, Graphs, Math, Strings, and more).',
  },
  {
    icon: Timer,
    color: 'text-orange-500',
    label: 'Mock Interview',
    desc: 'Simulated interview mode with a countdown timer. Pick a random or specific question, code under time pressure, and mark the outcome (solved, gave up, timeout). Session history logged with difficulty and elapsed time.',
  },
  {
    icon: Zap,
    color: 'text-yellow-500',
    label: 'Quick Review',
    desc: 'Rapid-fire flashcard blitz — 15 seconds to read the question, 15 seconds to view the solution, then auto-advance. Filter by difficulty and source. Good for high-speed recognition drilling.',
  },
  {
    icon: Brain,
    color: 'text-teal-500',
    label: 'Spaced Repetition',
    desc: 'Mark questions solved to start scheduling. Reviews spaced at 1 → 3 → 7 → 14 → 30 → 60 day intervals. Due reviews surface as a banner on the home page. Dedicated Review page shows your full queue with overdue indicators.',
  },
  {
    icon: Calendar,
    color: 'text-orange-400',
    label: 'Daily Study Plan',
    desc: 'Generate a locked daily plan across all 331 questions. Set questions per day, start date, and a lock code to hold yourself accountable. Tracks today\'s questions, past day history, and lets you do bonus days when you finish early.',
  },
  {
    icon: BarChart2,
    color: 'text-yellow-500',
    label: 'Stats Dashboard',
    desc: 'Solved count, progress by difficulty, total practice time. Two heatmaps: an activity heatmap (any day you solved something goes green) and a daily plan heatmap (red/yellow/green vs your daily target). LeetCode Police: set and lock a daily question goal with a code.',
  },
  {
    icon: MessageSquare,
    color: 'text-purple-500',
    label: 'Behavioral Prep',
    desc: '63 behavioral questions with STAR stories. Tabbed story view for each question. Category filter and shuffle mode. Mark questions as visited to track coverage.',
  },
  {
    icon: Server,
    color: 'text-sky-500',
    label: 'System Design',
    desc: 'System design flashcards covering classic design problems, core concepts, cloud patterns, and trade-offs. Includes interview tips and case studies.',
  },
  {
    icon: Gem,
    color: 'text-rose-500',
    label: 'Gems',
    desc: 'Curated career resources: recruiter email templates, interview strategies, salary negotiation scripts, big-O cheat sheet, and more. Flip-card format.',
  },
]

const TECH_STACK = [
  { label: 'Next.js 16', desc: 'App Router · React 19 · Turbopack' },
  { label: 'TypeScript', desc: 'End-to-end type safety' },
  { label: 'Tailwind CSS 4', desc: 'Utility-first styling' },
  { label: 'Supabase', desc: 'Postgres database & auth' },
  { label: 'Judge0 API', desc: 'Code execution engine (proxied)' },
  { label: 'CodeMirror 6', desc: 'In-browser code editor' },
  { label: 'highlight.js', desc: 'Syntax highlighting (DSA)' },
  { label: 'Lucide React', desc: 'Icon library' },
  { label: 'react-hot-toast', desc: 'Toast notifications' },
]

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-5 shadow-lg">
          <BookOpen size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">LeetMastery</h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto">
          A private, all-in-one interview preparation hub. Study LeetCode questions, practise under timed conditions, track spaced repetition, and prep for behavioural and system design — all in one place.
        </p>
      </div>

      {/* Features */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Features</h2>
        <div className="space-y-3">
          {FEATURES.map(({ icon: Icon, color, label, desc }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
              <div className={`shrink-0 mt-0.5 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-gray-900 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Tech Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TECH_STACK.map(({ label, desc }) => (
            <div key={label} className="bg-gray-800 rounded-xl p-3">
              <div className="text-sm font-bold text-indigo-400">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-800 text-sm mb-3">Data & Privacy</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>All progress — solved status, notes, spaced repetition schedules, practice code, mock sessions, and daily plan — is stored in Supabase, private to your account.</p>
          <p>Questions data is loaded from a static JSON file bundled with the app — no external API calls for question content.</p>
          <p>Code execution is proxied through a Next.js API route to Judge0 (open source) — your code is sent to their servers to run and is not stored.</p>
        </div>
      </div>
    </div>
  )
}
