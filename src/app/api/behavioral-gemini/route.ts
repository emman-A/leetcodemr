import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI, SchemaType, type ObjectSchema } from '@google/generative-ai'
import { BEHAVIORAL_RESUME_CONTEXT } from '@/lib/behavioralResumeContext'

export const runtime = 'nodejs'

const MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash'

const storyObjectSchema: ObjectSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING, description: 'Short label for the story tab' },
    situation: { type: SchemaType.STRING, description: 'STAR: context, 2–4 sentences, first person' },
    task: { type: SchemaType.STRING, description: 'STAR: goal or responsibility' },
    action: { type: SchemaType.STRING, description: 'STAR: specific steps you took' },
    result: { type: SchemaType.STRING, description: 'STAR: measurable outcome or learning' },
  },
  required: ['title', 'situation', 'task', 'action', 'result'],
}

const responseSchema: ObjectSchema = {
  type: SchemaType.OBJECT,
  properties: {
    stories: {
      type: SchemaType.ARRAY,
      items: storyObjectSchema,
      minItems: 3,
      maxItems: 3,
    },
  },
  required: ['stories'],
}

type Story = {
  title: string
  situation: string
  task: string
  action: string
  result: string
}

function isStory(x: unknown): x is Story {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.title === 'string' &&
    typeof o.situation === 'string' &&
    typeof o.task === 'string' &&
    typeof o.action === 'string' &&
    typeof o.result === 'string'
  )
}

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY?.trim()
  if (!key) {
    return NextResponse.json(
      {
        error:
          'GEMINI_API_KEY is not set. Add it to .env.local (see .env.example). Get a key at https://aistudio.google.com/apikey',
      },
      { status: 503 }
    )
  }

  let body: { question?: string; category?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  const category = typeof body.category === 'string' ? body.category.trim() : ''
  if (!question) {
    return NextResponse.json({ error: 'Missing question' }, { status: 400 })
  }

  const genAI = new GoogleGenerativeAI(key)
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema,
    },
  })

  const prompt = `You are an interview coach. The candidate will answer ONLY using the resume below. Generate exactly three distinct STAR-format behavioral interview stories for the question.

Rules:
- Output must be valid JSON: a single object with key "stories" whose value is an array of exactly 3 objects. Each story has keys: title, situation, task, action, result.
- Write in first person ("I"). Be specific and credible; tie stories to employers, projects, metrics, and tools from the resume when possible.
- If the question is hypothetical or not directly on the resume (e.g. "design for inclusion"), still answer well: combine resume themes (accessibility/RBAC at Geaux, clinical UX at MedDiagnose, teaching product at VisualizeMyAlgorithm) with sound general principles. Do not invent fake employers or degrees.
- Each STAR block should be interview-ready: Situation 2–4 sentences, Task 1–2 sentences, Action with concrete steps, Result with metrics or clear learning when available.
- Story titles should be short (under 8 words).

Category tag (for tone): ${category || 'General'}

RESUME:
${BEHAVIORAL_RESUME_CONTEXT}

QUESTION:
${question}`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const parsed = JSON.parse(text) as unknown
    const arr =
      parsed &&
      typeof parsed === 'object' &&
      'stories' in parsed &&
      Array.isArray((parsed as { stories: unknown }).stories)
        ? (parsed as { stories: unknown[] }).stories
        : null
    if (!arr || arr.length !== 3) {
      console.error('[behavioral-gemini] Unexpected shape:', text.slice(0, 500))
      return NextResponse.json({ error: 'Model returned an invalid story count' }, { status: 502 })
    }
    const stories = arr.filter(isStory)
    if (stories.length !== 3) {
      return NextResponse.json({ error: 'Model returned malformed stories' }, { status: 502 })
    }
    return NextResponse.json({ stories })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Gemini request failed'
    console.error('[behavioral-gemini]', e)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
