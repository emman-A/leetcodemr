/**
 * Study schedule: every 7th study day (day 7, 14, 21, …) is revision — union of
 * questions from the previous 6 study days' learning chunks, minus revision_cleared_ids.
 */

export type StudyDayKind = 'learning' | 'revision' | 'empty'

export interface StudyPlanSlice {
  per_day: number
  question_order: number[]
}

export function learningDaysBeforeStudyDay(studyDay: number): number {
  let c = 0
  for (let d = 1; d < studyDay; d++) {
    if (d % 7 !== 0) c++
  }
  return c
}

export function chunkSlice(plan: StudyPlanSlice, chunkIndex: number): number[] {
  const start = plan.per_day * chunkIndex
  const end = Math.min(start + plan.per_day, plan.question_order.length)
  return plan.question_order.slice(start, end)
}

export function numChunks(plan: StudyPlanSlice): number {
  return Math.ceil(plan.question_order.length / plan.per_day) || 0
}

/** Union of IDs from learning chunks assigned to the 6 study days before this revision day */
export function revisionCandidateIds(plan: StudyPlanSlice, studyDay: number): number[] {
  const n = numChunks(plan)
  const seen = new Set<number>()
  for (let d = studyDay - 6; d < studyDay; d++) {
    if (d <= 0) continue
    if (d % 7 === 0) continue
    const chunkIndex = learningDaysBeforeStudyDay(d)
    if (chunkIndex >= n) continue
    for (const id of chunkSlice(plan, chunkIndex)) seen.add(id)
  }
  return [...seen]
}

export function getStudyDayContent(
  plan: StudyPlanSlice,
  studyDay: number,
  revisionCleared: Set<number>
): { kind: StudyDayKind; questionIds: number[]; isRevisionDay: boolean; chunkIndex?: number } {
  const n = numChunks(plan)
  if (n === 0) return { kind: 'empty', questionIds: [], isRevisionDay: false }

  if (studyDay % 7 === 0) {
    const raw = revisionCandidateIds(plan, studyDay)
    const filtered = raw.filter(id => !revisionCleared.has(id))
    return { kind: 'revision', questionIds: filtered, isRevisionDay: true }
  }

  const chunkIndex = learningDaysBeforeStudyDay(studyDay)
  if (chunkIndex >= n) {
    return { kind: 'empty', questionIds: [], isRevisionDay: false }
  }

  return {
    kind: 'learning',
    questionIds: chunkSlice(plan, chunkIndex),
    isRevisionDay: false,
    chunkIndex,
  }
}

export function isDayComplete(
  questionIds: number[],
  progress: Record<string, { solved?: boolean }>
): boolean {
  if (questionIds.length === 0) return true
  return questionIds.every(id => progress[String(id)]?.solved)
}

function maxStudyDayBound(plan: StudyPlanSlice): number {
  const n = numChunks(plan)
  if (n === 0) return 1
  return n * 3 + 60
}

/** First study day (1-based) with unfinished work, or -1 if none */
export function findFirstIncompleteStudyDay(
  plan: StudyPlanSlice,
  progress: Record<string, { solved?: boolean }>,
  revisionCleared: Set<number>
): number {
  const hi = maxStudyDayBound(plan)
  for (let studyDay = 1; studyDay <= hi; studyDay++) {
    const { questionIds } = getStudyDayContent(plan, studyDay, revisionCleared)
    if (questionIds.length === 0) continue
    if (!isDayComplete(questionIds, progress)) return studyDay
  }
  return -1
}

/**
 * Last study day index in the plan (aligned to a revision boundary after all chunks assigned).
 * Used for progress bar denominator.
 */
export function computeTotalStudyDays(plan: StudyPlanSlice): number {
  const n = numChunks(plan)
  if (n === 0) return 0
  let studyDay = 0
  let maxChunkSeen = -1
  while (maxChunkSeen < n - 1) {
    studyDay++
    if (studyDay % 7 === 0) continue
    const ci = learningDaysBeforeStudyDay(studyDay)
    if (ci < n) maxChunkSeen = Math.max(maxChunkSeen, ci)
  }
  while (studyDay % 7 !== 0) studyDay++
  return studyDay
}
