import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const USER_ID = 'emmanuel'
const TZ = 'America/Chicago'

function todayCT() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ })
}

function nowHourCT(): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: 'numeric',
    hour12: false,
  }).formatToParts(new Date())
  return parseInt(parts.find(p => p.type === 'hour')?.value ?? '0')
}

export async function GET(req: NextRequest) {
  // Vercel cron sends: Authorization: Bearer <CRON_SECRET>
  // Manual calls can send: ?secret=<CRON_SECRET>
  const authHeader = req.headers.get('authorization') ?? ''
  const bearerSecret = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const querySecret = req.nextUrl.searchParams.get('secret')
  const secret = bearerSecret ?? querySecret

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // ── Load study plan ─────────────────────────────────────────────────────────
  const { data: plan } = await supabase
    .from('study_plan')
    .select('*')
    .eq('user_id', USER_ID)
    .single()

  if (!plan) return NextResponse.json({ skipped: 'No study plan found' })

  // ── Load progress ───────────────────────────────────────────────────────────
  const { data: progressRows } = await supabase
    .from('progress')
    .select('question_id,solved')
    .eq('user_id', USER_ID)

  const solvedSet = new Set<number>(
    (progressRows ?? []).filter((r: any) => r.solved).map((r: any) => Number(r.question_id))
  )

  // ── Compute today's day index (Central Time) ───────────────────────────────
  const todayStr = todayCT()
  const start = new Date(plan.start_date + 'T00:00:00')
  const now = new Date(todayStr + 'T00:00:00')
  start.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const totalDays = Math.ceil(plan.question_order.length / plan.per_day)

  if (diffDays < 0 || diffDays >= totalDays) {
    return NextResponse.json({ skipped: 'Plan not active today' })
  }

  // ── Find first incomplete day ───────────────────────────────────────────────
  let activeDayIndex = diffDays
  for (let i = 0; i <= diffDays; i++) {
    const ids: number[] = plan.question_order.slice(i * plan.per_day, i * plan.per_day + plan.per_day)
    if (!ids.every(id => solvedSet.has(id))) {
      activeDayIndex = i
      break
    }
  }

  const dayIds: number[] = plan.question_order.slice(
    activeDayIndex * plan.per_day,
    activeDayIndex * plan.per_day + plan.per_day
  )

  const solvedToday = dayIds.filter(id => solvedSet.has(id)).length
  const remaining = dayIds.length - solvedToday

  if (remaining === 0) return NextResponse.json({ skipped: 'All done for today!' })

  // ── Load questions from JSON ────────────────────────────────────────────────
  let allQuestions: any[] = []
  try {
    const raw = readFileSync(join(process.cwd(), 'public', 'questions_full.json'), 'utf-8')
    allQuestions = JSON.parse(raw)
  } catch { /* ignore */ }

  const qMap: Record<number, { title: string; difficulty: string; slug: string }> = {}
  for (const q of allQuestions) {
    qMap[q.id] = { title: q.title, difficulty: q.difficulty, slug: q.slug ?? '' }
  }

  // ── Build email ─────────────────────────────────────────────────────────────
  const appUrl = 'https://leetcodemr.vercel.app'
  const dayNumber = activeDayIndex + 1
  const hour = nowHourCT()
  const tod = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night'

  const greetings: Record<string, string> = {
    morning: '☀️ Good morning!',
    afternoon: '🌤 Afternoon check-in!',
    evening: '🌆 Evening reminder!',
    night: '🌙 Late-night heads up!',
  }
  const urgency: Record<string, string> = {
    morning: "Start your day strong — knock out today's questions early.",
    afternoon: "Afternoon's a great time to get these done.",
    evening: "Don't let the day slip by — finish strong tonight.",
    night: "Getting late! Finish up before midnight. You've got this.",
  }
  const subjects: Record<string, string> = {
    morning: `☀️ LeetCode Police — Day ${dayNumber}: ${remaining} question${remaining !== 1 ? 's' : ''} left`,
    afternoon: `🌤 Day ${dayNumber}: Still ${remaining} to go — wrap it up this afternoon!`,
    evening: `🌆 Day ${dayNumber}: ${remaining} question${remaining !== 1 ? 's' : ''} left — finish tonight!`,
    night: `🌙 Day ${dayNumber}: ${remaining} left and it's getting late — go finish!`,
  }

  let progressMsg: string
  if (solvedToday === 0) {
    progressMsg = "You haven't started today's questions yet."
  } else if (remaining === 1) {
    progressMsg = `Almost there — just 1 question left!`
  } else {
    progressMsg = `You've completed ${solvedToday}/${dayIds.length} — keep the momentum going.`
  }

  const diffColor: Record<string, string> = { Easy: '#16a34a', Medium: '#d97706', Hard: '#dc2626' }

  const rows = dayIds.map(id => {
    const q = qMap[id]
    const solved = solvedSet.has(id)
    const diff = q?.difficulty ?? ''
    const lcLink = q?.slug ? `https://leetcode.com/problems/${q.slug}/` : null
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;vertical-align:middle;">
          <span style="font-size:16px;margin-right:8px;">${solved ? '✅' : '⭕'}</span>
          <a href="${appUrl}/question/${id}" style="color:#4f46e5;text-decoration:none;font-weight:600;">#${id} ${q?.title ?? `Question ${id}`}</a>
          ${lcLink ? `&nbsp;<a href="${lcLink}" style="color:#9ca3af;font-size:12px;text-decoration:none;">[LC ↗]</a>` : ''}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;text-align:right;vertical-align:middle;">
          <span style="color:${diffColor[diff] ?? '#6b7280'};font-weight:700;font-size:13px;">${diff}</span>
        </td>
      </tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:24px;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px 32px;">
      <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;">📚 LeetMastery</div>
      <div style="color:#c7d2fe;font-size:14px;margin-top:4px;">LeetCode Police · Day ${dayNumber} of ${totalDays}</div>
    </div>

    <div style="padding:28px 32px;">
      <h2 style="margin:0 0 6px;font-size:20px;color:#111827;">${greetings[tod]}</h2>
      <p style="color:#374151;margin:0 0 6px;font-size:15px;">${urgency[tod]}</p>
      <p style="color:#6b7280;margin:0 0 24px;font-size:14px;">${progressMsg}</p>

      <table style="width:100%;border-collapse:collapse;">${rows}</table>

      <div style="margin-top:28px;text-align:center;">
        <a href="${appUrl}/daily"
           style="display:inline-block;background:#4f46e5;color:#fff;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;">
          Go Solve Now →
        </a>
      </div>
    </div>

    <div style="padding:16px 32px;background:#f9fafb;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">LeetMastery · Central Time · Sent daily at 8 AM</p>
    </div>
  </div>
</body>
</html>`

  const { data: emailData, error } = await resend.emails.send({
    from: 'LeetMastery <onboarding@resend.dev>',
    to: process.env.NOTIFICATION_EMAIL!,
    subject: subjects[tod],
    html,
  })

  if (error) {
    console.error('[notify-daily] Resend error:', error)
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ sent: true, remaining, day: dayNumber, emailId: emailData?.id })
}
