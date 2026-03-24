import { NextRequest, NextResponse } from 'next/server'

const JUDGE0_BASE = 'https://ce.judge0.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${JUDGE0_BASE}/submissions?base64_encoded=false`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code: body.source_code, language_id: body.language_id }),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    const res = await fetch(`${JUDGE0_BASE}/submissions/${token}?base64_encoded=false`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
