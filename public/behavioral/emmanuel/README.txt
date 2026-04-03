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

Notes
-----
- Visiting progress (visited cards) is stored in Supabase by question id; ids match the default set.
- Edit questions.json only with valid JSON (no comments inside the file).
