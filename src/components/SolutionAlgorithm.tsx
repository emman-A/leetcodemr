import { ListOrdered } from 'lucide-react'

/**
 * Optional algorithm summary shown above code on the Practice → Solution tab.
 * Data: questions_full.json `algorithm_name` + `solution_steps`.
 */
export default function SolutionAlgorithm({
  name,
  steps,
}: {
  name?: string
  steps?: string[]
}) {
  if (!name && (!steps || steps.length === 0)) return null

  return (
    <div
      id="solution-algorithm"
      className="mb-6 rounded-xl border border-indigo-100 bg-gradient-to-b from-indigo-50/80 to-white p-4 shadow-sm"
    >
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-700">
        <ListOrdered size={14} aria-hidden />
        Algorithm
      </h3>
      {name ? <p className="mb-3 text-sm font-semibold text-gray-900">{name}</p> : null}
      {steps && steps.length > 0 ? (
        <ol className="list-decimal space-y-2 pl-4 text-sm leading-relaxed text-gray-700 marker:font-semibold marker:text-indigo-600">
          {steps.map((s, i) => (
            <li key={i} className="pl-1">
              {s}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}
