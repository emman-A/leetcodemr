Emmanuel resume-backed behavioral STAR bank
==========================================

This folder holds questions.json: the same 63 prompts as the default app set, with three STAR
stories each (Situation, Task, Action, Result), tuned to Emmanuel Acheampong’s resume — Geaux
Network, Hubtel LTD, MedDiagnose AI, VisualizeMyAlgorithm, Mini-Compiler, NSBE, ColorStack,
and Grambling coursework/honors.

Style: standard behavioral interview STAR (Amazon/Google-style structure), aligned with the
fields shown on the Behavioural page in the app.

UNDO — go back to the original bundled questions
------------------------------------------------
In src/app/(app)/behavioral/page.tsx, change:

  BEHAVIORAL_QUESTIONS_URL = '/behavioral/emmanuel/questions.json'

back to:

  BEHAVIORAL_QUESTIONS_URL = '/behavioral_questions.json'

Or delete this entire public/behavioral/emmanuel/ folder after reverting that line.

Optional: Gemini-generated STAR drafts
--------------------------------------
On the Behavioural page, flip a card and use “Generate with Gemini”. The API reads resume
context from src/lib/behavioralResumeContext.ts (not this JSON file). Set GEMINI_API_KEY in
.env.local — see repo .env.example.

Bake all questions once (no API calls when studying)
----------------------------------------------------
Pricing: baking uses one Gemini API request per question (free-tier quota or paid tokens).
After stories live in questions.json, the Behavioural page only fetch()es JSON — zero Gemini cost.

Run locally from the repo root (uses .env.local for GEMINI_API_KEY; optional GEMINI_MODEL):

  npm run bake:behavioral:dry       # test: first question only, 5s delay (gemini-2.0-flash)
  npm run bake:behavioral:dry:15    # same, but gemini-1.5-flash (often different free-tier bucket)
  npm run bake:behavioral           # full file: all ids in range (long run; ~25s between calls)
  npm run bake:behavioral:15        # full bake with gemini-1.5-flash

This overwrites questions.json in place and creates a timestamped .bak backup first.
Resume text is read from src/lib/behavioralResumeContext.ts — edit that before baking.

Extra CLI flags (use -- after npm run):

  npm run bake:behavioral -- --from=1 --to=5 --delay=30000
  node scripts/bake-behavioral-gemini.mjs --from=1 --to=5 --delay=30000
  node scripts/bake-behavioral-gemini.mjs --input=public/behavioral_questions.json --output=public/behavioral_questions.json
  node scripts/bake-behavioral-gemini.mjs --model=gemini-1.5-flash

After baking, commit the JSON and deploy — the Behavioural page fetch() needs no Gemini quota.

Notes
-----
- Visiting progress (visited cards) is stored in Supabase by question id; ids match the default set.
- Edit questions.json only with valid JSON (no comments inside the file).
