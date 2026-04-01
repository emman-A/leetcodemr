'use client'

/**
 * Line Recall code view: same One Dark / hljs styling as CodePanel + question pages.
 * Isolated file — remove this component and its import from LineGameSession to undo styling.
 */

import { useMemo } from 'react'
import { Check, Eye } from 'lucide-react'
import hljs from 'highlight.js/lib/core'
import pythonLang from 'highlight.js/lib/languages/python'
import { normalizeAnswerLine } from '@/lib/lineGame/pickBlankLines'
import type { BlankLinePick } from '@/lib/lineGame/pickBlankLines'

hljs.registerLanguage('python', pythonLang)

export function splitLeadingIndent(line: string): { indent: string; rest: string } {
  const m = line.match(/^([\t ]*)([\s\S]*)$/)
  return { indent: m?.[1] ?? '', rest: m?.[2] ?? '' }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Highlight one line of Python (matches CodePanel / flashcard solution blocks). */
export function highlightPythonLine(line: string): string {
  const raw = line.replace(/\r/g, '')
  if (raw.length === 0) return '&#160;'
  if (/^\s+$/.test(raw)) {
    return escapeHtml(raw)
  }
  try {
    return hljs.highlight(raw, { language: 'python', ignoreIllegals: true }).value
  } catch {
    return escapeHtml(raw)
  }
}

type BlankUiState = {
  input: string
  wrongCount: number
  solved: boolean
  revealed: boolean
}

const HLJS_STYLES = `
  .line-game-hljs .hljs { background: transparent; color: #abb2bf; }
  .line-game-hljs .hljs-keyword { color: #c678dd; }
  .line-game-hljs .hljs-built_in { color: #e6c07b; }
  .line-game-hljs .hljs-string { color: #98c379; }
  .line-game-hljs .hljs-number { color: #d19a66; }
  .line-game-hljs .hljs-comment { color: #5c6370; font-style: italic; }
  .line-game-hljs .hljs-function .hljs-title, .line-game-hljs .hljs-title.function_ { color: #61afef; }
  .line-game-hljs .hljs-class .hljs-title, .line-game-hljs .hljs-title.class_ { color: #e5c07b; }
  .line-game-hljs .hljs-params { color: #abb2bf; }
  .line-game-hljs .hljs-operator { color: #56b6c2; }
  .line-game-hljs .hljs-punctuation { color: #abb2bf; }
  .line-game-hljs .hljs-attr { color: #e06c75; }
  .line-game-hljs .hljs-variable { color: #e06c75; }
  .line-game-hljs .hljs-literal { color: #56b6c2; }
  .line-game-hljs .hljs-type { color: #e5c07b; }
`

export default function LineGameHighlightedCode({
  lines,
  blanks,
  blankStates,
  onInputChange,
  onCheck,
}: {
  lines: string[]
  blanks: BlankLinePick[]
  blankStates: BlankUiState[]
  onInputChange: (blankOrder: number, value: string) => void
  onCheck: (blankOrder: number) => void
}) {
  const blankByLine = useMemo(() => {
    const m = new Map<number, number>()
    blanks.forEach((b, i) => m.set(b.lineIndex, i))
    return m
  }, [blanks])

  const highlightedStatic = useMemo(() => {
    return lines.map(line => highlightPythonLine(line))
  }, [lines])

  return (
    <>
      <style>{HLJS_STYLES}</style>
      <div className="rounded-xl overflow-hidden border border-gray-700 bg-[#282c34] text-sm font-mono">
        <div className="px-3 py-2 border-b border-gray-600 text-gray-400 text-xs">Python (Simply Leet)</div>
        <div className="p-4 overflow-x-auto max-h-[min(70vh,520px)] overflow-y-auto line-game-hljs">
          <div className="text-[13px] leading-relaxed">
            {lines.map((line, lineIdx) => {
              const bi = blankByLine.get(lineIdx)
              if (bi === undefined) {
                return (
                  <div key={lineIdx} className="flex flex-row items-start gap-0 min-h-[1.35rem]">
                    <span className="text-[#5c6370] select-none shrink-0 w-9 text-right text-[11px] tabular-nums pt-0.5 pr-2">
                      {lineIdx + 1}
                    </span>
                    <code
                      className="hljs language-python block flex-1 min-w-0 whitespace-pre pl-0 m-0 bg-transparent"
                      dangerouslySetInnerHTML={{
                        __html: highlightedStatic[lineIdx] || '&#160;',
                      }}
                    />
                  </div>
                )
              }

              const st = blankStates[bi]
              const expected = blanks[bi].expected
              const showAnswer = st?.solved || st?.revealed
              const norm = normalizeAnswerLine(expected)
              const hintLen = norm.length
              const prefix = norm.slice(0, 4)
              const { indent, rest } = splitLeadingIndent(expected)

              let border = 'border-gray-600'
              let bg = 'bg-[#1e222a]'
              if (st?.solved) {
                border = 'border-green-500/70'
                bg = 'bg-green-950/40'
              } else if (st?.revealed) {
                border = 'border-amber-500/50'
                bg = 'bg-amber-950/30'
              }

              const innerHtml = highlightPythonLine(expected)

              return (
                <div key={lineIdx} className="my-1.5">
                  <div className="flex flex-row items-start gap-0">
                    <span className="text-[#5c6370] select-none shrink-0 w-9 text-right text-[11px] tabular-nums pt-1 pr-2">
                      {lineIdx + 1}
                    </span>
                    <div className={`flex-1 min-w-0 rounded border ${border} ${bg} px-0 py-1`}>
                      {showAnswer ? (
                        <code
                          className="hljs language-python block whitespace-pre pl-2 pr-2 m-0 bg-transparent"
                          dangerouslySetInnerHTML={{ __html: innerHtml }}
                        />
                      ) : (
                        <>
                          <div className="flex flex-row items-start pl-2 pr-2 gap-0 min-h-[1.75rem]">
                            {indent.length > 0 && (
                              <span
                                className="shrink-0 text-[#5c6370] whitespace-pre select-none pt-1.5 font-mono text-[13px] leading-relaxed"
                                aria-hidden
                              >
                                {indent}
                              </span>
                            )}
                            <textarea
                              value={st?.input ?? ''}
                              onChange={e => onInputChange(bi, e.target.value)}
                              rows={Math.max(1, Math.min(8, expected.split('\n').length + 1))}
                              spellCheck={false}
                              className={`flex-1 min-w-0 min-h-[1.75rem] py-1.5 rounded-none border-0 bg-transparent text-[#abb2bf] placeholder:text-gray-600 focus:outline-none focus:ring-0 resize-y font-mono text-[13px] leading-relaxed`}
                              placeholder={rest ? '…' : 'Type the line…'}
                              style={{ tabSize: 4 }}
                            />
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 px-2 pb-1">
                            <button
                              type="button"
                              onClick={() => onCheck(bi)}
                              disabled={st?.solved || st?.revealed}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-40"
                            >
                              <Check size={14} />
                              Check
                            </button>
                            {st && st.wrongCount >= 1 && !st.solved && (
                              <span className="text-xs text-gray-400">
                                Length: {hintLen} chars (normalized spaces)
                              </span>
                            )}
                            {st && st.wrongCount >= 2 && !st.solved && !st.revealed && (
                              <span className="text-xs text-amber-300/90">Starts with: {JSON.stringify(prefix)}</span>
                            )}
                            {st && st.revealed && !st.solved && (
                              <span className="text-xs text-amber-400 flex items-center gap-1">
                                <Eye size={12} />
                                Revealed after 3 tries
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
