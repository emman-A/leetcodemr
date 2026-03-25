import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const USER_ID = 'emmanuel'
const TZ = 'America/Chicago'

function todayCT() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ })
}

function nowHourMinuteCT(): { hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date())
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0')
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0')
  return { hour, minute }
}

export async function GET(req: NextRequest) {
  // Protect with secret so only Vercel Cron can call it
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Load study plan
  const { data: plan } = await supabase
    .from('study_plan')
    .select('*')
    .eq('user_id', USER_ID)
    .single()

  if (!plan) {
    return NextResponse.json({ skipped: 'No study plan found' })
  }

  // Load progress
  const { data: progressRows } = await supabase
    .from('progress')
    .select('question_id,solved')
    .eq('user_id', USER_ID)

  const solvedSet = new Set<number>(
    (progressRows ?? []).filter((r: any) => r.solved).map((r: any) => r.question_id)
  )

  // Compute today's day index (same logic as daily page)
  const start = new Date(plan.start_date + 'T00:00:00')
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }))
  now.setHours(0, 0, 0, 0)
  start.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const totalDays = Math.ceil(plan.question_order.length / plan.per_day)

  if (diffDays < 0 || diffDays >= totalDays) {
    return NextResponse.json({ skipped: 'Plan not active today' })
  }

  // Find first incomplete day (same as daily page logic)
  let activeDayIndex = diffDays
  for (let i = 0; i <= diffDays; i++) {
    const ids = plan.question_order.slice(i * plan.per_day, i * plan.per_day + plan.per_day) as number[]
    if (!ids.every((id: number) => solvedSet.has(id))) {
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

  // All done — skip
  if (remaining === 0) {
    return NextResponse.json({ skipped: 'All done for today!' })
  }

  // Load question titles
  const { data: qRows } = await supabase
    .from('questions')
    .select('id,title,difficulty,slug')
    .in('id', dayIds)
    .catch(() => ({ data: null }))

  // Fallback: read from questions_full.json won't work server-side without fs, so use title from IDs
  const qMap: Record<number, { title: string; difficulty: string; slug: string }> = {}
  for (const q of qRows ?? []) {
    qMap[q.id] = { title: q.title, difficulty: q.difficulty, slug: q.slug }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://leetcodemr.vercel.app'
  const dayNumber = activeDayIndex + 1

  // Time-of-day + progress tailored messaging
  const { hour } = nowHourMinuteCT()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night'

  const timeGreeting: Record<string, string> = {
    morning: '☀️ Good morning!',
    afternoon: '🌤 Afternoon check-in!',
    evening: '🌆 Evening reminder!',
    night: '🌙 Late night heads up!',
  }

  const timeUrgency: Record<string, string> = {
    morning: 'Start your day strong — knock out today\'s questions.',
    afternoon: 'Afternoon\'s a great time to get these done.',
    evening: 'Don\'t let the day slip by — you\'re so close to done.',
    night: 'Getting late! Finish up before midnight. You\'ve got this.',
  }

  let progressMessage: string
  if (solvedToday === 0) {
    progressMessage = "You haven't started today's questions yet."
  } else if (solvedToday === dayIds.length - 1) {
    progressMessage = `Almost there — just 1 question left!`
  } else {
    progressMessage = `You've done ${solvedToday}/${dayIds.length} — keep the momentum going.`
  }

  const subjectMap: Record<string, string> = {
    morning: `☀️ Day ${dayNumber}: ${remaining} question${remaining !== 1 ? 's' : ''} to go — morning grind time!`,
    afternoon: `🌤 Day ${dayNumber}: Still ${remaining} left — finish before evening!`,
    evening: `🌆 Day ${dayNumber}: ${remaining} question${remaining !== 1 ? 's' : ''} left — wrap it up tonight!`,
    night: `🌙 Day ${dayNumber}: ${remaining} left and it's getting late — go finish!`,
  }

  const diffColor: Record<string, string> = {
    Easy: '#16a34a',
    Medium: '#d97706',
    Hard: '#dc2626',
  }

  const questionRows = dayIds.map(id => {
    const q = qMap[id]
    const solved = solvedSet.has(id)
    const diff = q?.difficulty ?? ''
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
          <span style="color:${solved ? '#16a34a' : '#6b7280'};font-size:18px;margin-right:8px;">${solved ? '✅' : '⭕'}</span>
          <a href="${appUrl}/question/${id}" style="color:#4f46e5;text-decoration:none;font-weight:600;">#${id} ${q?.title ?? `Question ${id}`}</a>
          ${q?.slug ? `&nbsp;<a href="https://leetcode.com/problems/${q.slug}/" style="color:#9ca3af;font-size:12px;">[LC ↗]</a>` : ''}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;">
          <span style="color:${diffColor[diff] ?? '#6b7280'};font-weight:700;font-size:13px;">${diff}</span>
        </td>
      </tr>`
  }).join('')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:24px;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px 32px;">
      <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;">📚 LeetMastery</div>
      <div style="color:#c7d2fe;font-size:14px;margin-top:4px;">LeetCode Police — Day ${dayNumber}</div>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <h2 style="margin:0 0 6px;font-size:20px;color:#111827;">${timeGreeting[timeOfDay]}</h2>
      <p style="color:#374151;margin:0 0 6px;font-size:15px;">${timeUrgency[timeOfDay]}</p>
      <p style="color:#6b7280;margin:0 0 24px;font-size:14px;">${progressMessage}</p>

      <table style="width:100%;border-collapse:collapse;">
        ${questionRows}
      </table>

      <div style="margin-top:24px;text-align:center;">
        <a href="${appUrl}/daily" style="display:inline-block;background:#4f46e5;color:#fff;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:15px;">
          Go Solve Now →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;background:#f9fafb;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">LeetMastery · Sent every 30 min until you finish</p>
    </div>
  </div>
</body>
</html>`

  const to = process.env.NOTIFICATION_EMAIL!
  const { data: emailData, error } = await resend.emails.send({
    from: 'LeetMastery <onboarding@resend.dev>',
    to,
    subject: subjectMap[timeOfDay],
    html,
  })

  if (error) {
    console.error('[notify-daily] Resend error:', error)
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ sent: true, to, remaining, emailId: emailData?.id })
}
