import { NextRequest, NextResponse } from 'next/server'

const JUDGE0 = 'https://ce.judge0.com'

export async function POST(req: NextRequest) {
  try {
    const { source_code, language_id } = await req.json()

    // 1. Submit
    const submitRes = await fetch(`${JUDGE0}/submissions?base64_encoded=false`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code, language_id }),
    })
    const { token } = await submitRes.json()
    if (!token) {
      return NextResponse.json({ error: 'No token from Judge0' }, { status: 500 })
    }

    // 2. Poll until done (status > 2 means not queued/processing)
    let result: any = null
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 700))
      const r = await fetch(`${JUDGE0}/submissions/${token}?base64_encoded=false`)
      result = await r.json()
      if (result?.status?.id > 2) break
    }

    return NextResponse.json(result ?? { error: 'Timed out' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
