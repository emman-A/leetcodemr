'use client'
import { BookOpen, CheckCircle, Layers, BarChart2, MessageSquare, Gem, Server, Calendar, Code2, Brain } from 'lucide-react'

const FEATURES = [
  { icon: CheckCircle,   color: 'text-green-500',  label: 'Questions Library',   desc: '331 LeetCode questions with Python & C++ solutions, difficulty badges, and source tags (Grind 169, Denny Zhang, Premium 98, CodeSignal).' },
  { icon: Layers,        color: 'text-indigo-500', label: 'Flashcard Mode',      desc: 'Study questions as flashcards with filter by difficulty and source. Flip to reveal solutions. Keyboard navigation support.' },
  { icon: Code2,         color: 'text-blue-500',   label: 'Practice Editor',     desc: 'Write and run code directly in the browser using the Piston API. Supports Python, JavaScript, Java, and C++. Auto-saves your code.' },
  { icon: BarChart2,     color: 'text-yellow-500', label: 'Stats Dashboard',     desc: 'Track your solved count, progress by difficulty, 52-week activity heatmap, and total practice time.' },
  { icon: MessageSquare, color: 'text-purple-500', label: 'Behavioral Prep',     desc: '63 behavioral questions with 3 STAR stories each. Tabbed story view. Category filter and shuffle mode.' },
  { icon: Server,        color: 'text-sky-500',    label: 'System Design',       desc: 'System design flashcards covering design problems, core concepts, cloud patterns and tradeoffs. Plus interview tips and case studies.' },
  { icon: Gem,           color: 'text-rose-500',   label: 'Gems',                desc: 'Recruiter email templates, interview strategies, salary negotiation tips, big-O reference, and more.' },
  { icon: Calendar,      color: 'text-orange-500', label: 'Daily Study Plan',    desc: 'Generate a locked daily plan. Set questions per day, start date, and a lock code. Track today\'s questions and past days.' },
  { icon: Brain,         color: 'text-teal-500',   label: 'Spaced Repetition',   desc: 'Mark questions as solved to start spaced repetition scheduling. Reviews scheduled at 1, 3, 7, 14, 30, 60 day intervals.' },
]

const TECH_STACK = [
  { label: 'Next.js 16', desc: 'App Router, TypeScript' },
  { label: 'Tailwind CSS 4', desc: 'Utility-first styling' },
  { label: 'Supabase', desc: 'Database & auth backend' },
  { label: 'Piston API', desc: 'Code execution engine' },
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
          A private, all-in-one interview preparation hub built for serious candidates. Study LeetCode questions, behavioral stories, system design, and more — all tracked in one place.
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

      {/* Data */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-800 text-sm mb-3">Data & Privacy</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>All your progress (solved status, notes, spaced repetition, practice code) is stored in Supabase, private to your account.</p>
          <p>Questions data is loaded from a static JSON file at runtime — no external API calls for questions.</p>
          <p>Code execution uses the Piston API (open source) — code is sent to their servers to run.</p>
        </div>
      </div>
    </div>
  )
}
