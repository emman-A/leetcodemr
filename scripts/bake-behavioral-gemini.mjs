#!/usr/bin/env node
/**
 * One-time (or occasional) batch: call Gemini for each behavioral question and write stories
 * into questions.json so the app needs no API calls when studying.
 *
 * Usage (from repo root):
 *   GEMINI_API_KEY=... node scripts/bake-behavioral-gemini.mjs
 *   # or rely on .env.local (loaded automatically)
 *
 * Options:
 *   --input=path     JSON file (default: public/behavioral/emmanuel/questions.json)
 *   --output=path    Write here (default: same as --input)
 *   --from=id        First question id (default: 1)
 *   --to=id          Last question id (default: last in file)
 *   --delay=ms       Pause between successful calls (default: 25000)
 *   --dry-run        Only process the first question in range (for testing)
 *   --model=name     Override GEMINI_MODEL / default gemini-2.0-flash
 *
 * On 429, waits and retries up to 8 times per question.
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

function loadEnvLocal() {
  const p = join(ROOT, '.env.local')
  if (!existsSync(p)) return
  const text = readFileSync(p, 'utf8')
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const k = t.slice(0, eq).trim()
    let v = t.slice(eq + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    if (!process.env[k]) process.env[k] = v
  }
}

loadEnvLocal()

function loadResumeContext() {
  const p = join(ROOT, 'src/lib/behavioralResumeContext.ts')
  const ts = readFileSync(p, 'utf8')
  const m = ts.match(/export const BEHAVIORAL_RESUME_CONTEXT = `([\s\S]*?)`\.trim\(\)/m)
  if (!m) {
    throw new Error('Could not parse BEHAVIORAL_RESUME_CONTEXT from src/lib/behavioralResumeContext.ts')
  }
  return m[1].trim()
}

const storyObjectSchema = {
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

const responseSchema = {
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

function isStory(x) {
  if (!x || typeof x !== 'object') return false
  const o = x
  return (
    typeof o.title === 'string' &&
    typeof o.situation === 'string' &&
    typeof o.task === 'string' &&
    typeof o.action === 'string' &&
    typeof o.result === 'string'
  )
}

function buildPrompt(resume, question, category) {
  return `You are an interview coach. The candidate will answer ONLY using the resume below. Generate exactly three distinct STAR-format behavioral interview stories for the question.

Rules:
- Output must be valid JSON: a single object with key "stories" whose value is an array of exactly 3 objects. Each story has keys: title, situation, task, action, result.
- Write in first person ("I"). Be specific and credible; tie stories to employers, projects, metrics, and tools from the resume when possible.
- If the question is hypothetical or not directly on the resume (e.g. "design for inclusion"), still answer well: combine resume themes (accessibility/RBAC at Geaux, clinical UX at MedDiagnose, teaching product at VisualizeMyAlgorithm) with sound general principles. Do not invent fake employers or degrees.
- Each STAR block should be interview-ready: Situation 2–4 sentences, Task 1–2 sentences, Action with concrete steps, Result with metrics or clear learning when available.
- Story titles should be short (under 8 words).

Category tag (for tone): ${category || 'General'}

RESUME:
${resume}

QUESTION:
${question}`
}

function parseArgs() {
  const out = {
    input: join(ROOT, 'public/behavioral/emmanuel/questions.json'),
    output: null,
    fromId: 1,
    toId: null,
    delayMs: 25000,
    dryRun: false,
    model: null,
  }
  for (const a of process.argv.slice(2)) {
    if (a === '--dry-run') out.dryRun = true
    else if (a.startsWith('--input=')) out.input = a.slice(8)
    else if (a.startsWith('--output=')) out.output = a.slice(9)
    else if (a.startsWith('--from=')) out.fromId = Number(a.slice(7))
    else if (a.startsWith('--to=')) out.toId = Number(a.slice(5))
    else if (a.startsWith('--delay=')) out.delayMs = Number(a.slice(8))
    else if (a.startsWith('--model=')) out.model = a.slice(8).trim()
  }
  if (!out.output) out.output = out.input
  return out
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function parseRetrySeconds(errMsg) {
  const m = String(errMsg).match(/retry in ([\d.]+)s/i)
  return m ? Math.ceil(Number(m[1]) * 1000) + 2000 : 65000
}

const MAX_QUOTA_RETRIES = 8

function printQuotaHelp(modelName, errMsg) {
  const m = String(errMsg)
  console.error('\n--- Gemini quota / rate limit ---')
  console.error('This bake uses one API call per question (billable or free-tier quota).')
  if (m.includes('limit: 0') || m.includes('Quota exceeded')) {
    console.error('Your project may have hit daily free-tier limits for this model.')
    console.error('Try later (24h reset), enable billing in Google Cloud, or use another model, e.g.:')
    console.error(`  npm run bake:behavioral:dry:15`)
    console.error(`  node scripts/bake-behavioral-gemini.mjs --model=gemini-1.5-flash`)
  } else {
    console.error(`Current model: ${modelName}`)
    console.error('Docs: https://ai.google.dev/gemini-api/docs/rate-limits')
  }
  console.error('After stories are saved in questions.json, studying in the app costs no API calls.\n')
}

async function generateStories(genAI, modelName, resume, question, category) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema,
    },
  })
  const prompt = buildPrompt(resume, question, category)
  let lastErr
  for (let attempt = 0; attempt < MAX_QUOTA_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      const parsed = JSON.parse(text)
      const arr = parsed?.stories
      if (!Array.isArray(arr) || arr.length !== 3) {
        throw new Error(`Bad response shape: ${text.slice(0, 200)}`)
      }
      const stories = arr.filter(isStory)
      if (stories.length !== 3) throw new Error('Malformed story objects')
      return stories
    } catch (e) {
      lastErr = e
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('429') || msg.includes('Too Many Requests') || msg.includes('quota')) {
        const wait = parseRetrySeconds(msg)
        console.warn(
          `  Rate limited; waiting ${Math.round(wait / 1000)}s before retry ${attempt + 1}/${MAX_QUOTA_RETRIES}…`
        )
        await sleep(wait)
        continue
      }
      throw e
    }
  }
  printQuotaHelp(modelName, lastErr instanceof Error ? lastErr.message : String(lastErr))
  throw lastErr
}

async function main() {
  const args = parseArgs()
  const key = process.env.GEMINI_API_KEY?.trim()
  if (!key) {
    console.error('Missing GEMINI_API_KEY. Set it in .env.local or the environment.')
    process.exit(1)
  }
  const modelName = args.model || process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash'
  console.log(`Model: ${modelName} — each question = 1 Gemini request; JSON in repo = 0 requests when studying.\n`)
  const resume = loadResumeContext()
  const raw = readFileSync(args.input, 'utf8')
  const questions = JSON.parse(raw)
  if (!Array.isArray(questions)) {
    console.error('Input JSON must be an array of questions')
    process.exit(1)
  }

  const maxId = Math.max(...questions.map(q => q.id))
  const toId = args.toId ?? maxId
  const targets = questions.filter(q => q.id >= args.fromId && q.id <= toId)
  const toProcess = args.dryRun ? targets.slice(0, 1) : targets

  if (toProcess.length === 0) {
    console.error('No questions in id range')
    process.exit(1)
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = `${args.output}.bak.${stamp}`
  copyFileSync(args.input, backupPath)
  console.log(`Backup: ${backupPath}`)

  const genAI = new GoogleGenerativeAI(key)
  let done = 0

  for (const q of toProcess) {
    done++
    console.log(`[${done}/${toProcess.length}] id=${q.id} — ${q.question.slice(0, 60)}…`)
    try {
      const stories = await generateStories(genAI, modelName, resume, q.question, q.category)
      q.stories = stories
      writeFileSync(args.output, JSON.stringify(questions, null, 4) + '\n', 'utf8')
      console.log(`  ✓ wrote ${args.output}`)
    } catch (e) {
      console.error(`  ✗ failed:`, e instanceof Error ? e.message : e)
      process.exit(1)
    }
    if (done < toProcess.length && args.delayMs > 0) {
      console.log(`  …waiting ${args.delayMs}ms\n`)
      await sleep(args.delayMs)
    }
  }

  console.log('\nDone. Commit the updated JSON and deploy — Behavioural cards will not need Gemini for these questions.')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
