/**
 * One-off generator for public/behavioral_questions.json
 * Run: node scripts/generate-behavioral-questions.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(__dirname, '..', 'public', 'behavioral_questions.json')

const S = (title, situation, task, action, result) => ({
  title,
  situation,
  task,
  action,
  result,
})

// —— Explicit problem → goal → steps → outcome (resume-aligned) ——
const GEAUX_CH = [
  S(
    'Change History: event consolidation',
    'Geaux Network — Associate Software Developer Intern, May–Aug 2025, remote. Problem: engineering and content both needed audit trails for podcast and media edits, but events lived in multiple backends with inconsistent schemas.',
    'Goal: ship Change History (TypeScript, SCSS) that improves traceability on v1 without blocking the release on full consolidation.',
    'Steps: (1) Joint session with engineering + content to rank event sources by traceability value per engineering week. (2) Phase 1 UI: highest-signal protobuf-backed events first. (3) Integration tests on merged read path before adding sources.',
    'Outcome: stronger traceability for targeted workflows; stable release cadence; backlog defined for remaining sources.',
  ),
  S(
    'gRPC service layer + tests',
    'Context: internal services moving to Java + gRPC + Protocol Buffers for podcast ingestion and distribution (10,000+ monthly listeners). Ingestion errors propagate to creators and listeners.',
    'Goal: raise measured data accuracy on the ingestion path; keep protobuf contracts testable at the RPC boundary.',
    'Steps: extend Java service layer; tighten .proto files; add end-to-end tests across gRPC; validate against real ingestion runs, not mocks only.',
    'Outcome: ~2× measured accuracy on ingestion path (team metric); safer downstream integrations.',
  ),
  S(
    'RBAC, logging, and a11y on RPC',
    'Constraint: creator vs admin flows on overlapping surfaces; compliance requires auditable mutations and usable UI for both roles.',
    'Goal: RBAC on sensitive gRPC methods + structured logs + accessibility coverage — without stalling feature delivery.',
    'Steps: enforce role rules on critical RPCs; log interaction events on mutations; keyboard + screen-reader pass on primary creator/admin screens tied to those RPCs.',
    'Outcome: fewer wrong-role failures in QA; clearer audit trail; explicit creator/admin behavior.',
  ),
]

const HUBTEL = [
  S(
    'Kafka/MQTT/Postgres pipeline',
    'Hubtel — Software Engineer Intern, Jun–Sep 2023, Ghana. Problem: high-volume system events for transaction-heavy services; slow failure detection hurt availability and trust.',
    'Goal: shorten detection time for pipeline failures without destabilizing payment paths.',
    'Stack + method: Kafka Connect → MQTT → PostgreSQL; trace broker to sink; integration tests + metrics to localize failures before restart-first debugging.',
    'Outcome: ~40% faster downtime detection (team baseline); fewer blind incidents on payment flows.',
  ),
  S(
    'Spring Boot test expansion',
    'Problem: failures appeared at integration boundaries (DB, messaging, HTTP), not in isolated unit tests — typical for payment-related Spring services.',
    'Goal: increase confidence on money-touching code paths.',
    'Steps: 20+ tests using Spring Boot, JUnit, Postman; cases centered on transaction boundaries, retries, and known failure modes.',
    'Outcome: ~80% reliability lift in targeted areas (team measurement); regressions caught pre-release more often.',
  ),
  S(
    'Firebase push latency',
    'Problem: users needed immediate transaction/status updates; flaky push masked healthy backends.',
    'Goal: minimize end-to-end latency for critical push notifications.',
    'Steps: implement Firebase path; measure latency; tune batching and delivery; document where sub-10ms is realistic given device and network.',
    'Outcome: faster user-visible status updates; aligned with pipeline observability (fewer false “outage” reports).',
  ),
]

const MED = [
  S(
    'MedDiagnose stack + pilot',
    'Project: MedDiagnose AI — Python, TypeScript, FastAPI, TensorFlow, React. Features: real-time monitoring, NIHSS scoring, RBAC, automated tPA eligibility.',
    'Goal: Louisiana hospital pilot optimized for workflow time — not leaderboard accuracy.',
    'Execution: FastAPI + React + model integration; Random Forest stroke-risk ~45% — positioned as decision support only; workflow KPIs agreed with neurologists.',
    'Outcome: pilot completed; ~35% reduction in time-to-treatment (pilot metric); assistive workflow, not autonomous diagnosis.',
  ),
  S(
    'ML + clinical translation',
    'Gap: engineers report accuracy; clinicians need override rules, failure modes, shift-time usability.',
    'Goal: assistive ML with explicit human checkpoints.',
    'Steps: plain-language model explanation in UI; documented uncertainty; UI blocks high-risk actions without clinician acknowledgment.',
    'Outcome: trust in rounds; automation limited to routing, alerts, eligibility prep — within hospital risk tolerance.',
  ),
  S(
    'Full-stack reliability',
    'Risk: real-time monitoring — UI errors mimic clinical emergencies; RBAC errors expose PHI.',
    'Goal: load-stable UI + correct role separation end to end.',
    'Steps: RBAC on all sensitive routes; consistent API error schema; optimize React paths on time-critical monitoring views.',
    'Outcome: pilot sessions without access-control incidents; IT checklist satisfied for role separation.',
  ),
]

const VIZ = [
  S(
    'VisualizeMyAlgorithm scale',
    'Product: VisualizeMyAlgorithm (React) — pathfinding, sorting, NN-style demos. Reach: 1,000+ learners.',
    'Goal: classroom-scale performance + teaching clarity.',
    'Build: modular components (Dijkstra, A*, Minimax, NN demos); explicit step state machine; batched rendering pipeline.',
    'Outcome: ~40% faster self-reported time-to-understanding (informal classroom timing); stable under concurrent classroom load.',
  ),
  S(
    'State + performance',
    'Issue: large graph state → React rerender storms → dropped frames on mid-tier laptops.',
    'Goal: smooth stepping on classroom hardware.',
    'Steps: batch updates per simulation tick; memoize graph structures; per-frame work budget.',
    'Outcome: usable in lecture halls without high-end GPUs.',
  ),
  S(
    'Pedagogy + engineering',
    'Teaching constraint: each frame must map to a checkable invariant (frontier, relaxed edge, etc.).',
    'Goal: tie every animation to pseudocode — zero unexplained motion.',
    'Steps: label invariant in UI at each step; sync visual state to algorithm state vector.',
    'Outcome: improved retention on follow-up quizzes (informal instructor feedback).',
  ),
]

const COMPILER = [
  S(
    'Mini-compiler engineering',
    'Project: Mini-Compiler — C, C++, Python, Yacc. Audience: students learning compiler construction.',
    'Goal: correct reference implementation suitable for coursework extension.',
    'Implementation: lexer, parser, IR, constant folding, dead-code elimination, structured compiler error messages.',
    'Outcome: 50+ users; ~35% self-reported reduction in debug time vs unstructured edit-compile cycles.',
  ),
  S(
    'Correctness first',
    'Failure mode: lexer/parser edge cases produced corrupt IR; optimizations hid bugs.',
    'Goal: green parser/lexer suite before optimization passes.',
    'Steps: expand grammar tests; regression tokens; gate optimizations on passing baseline.',
    'Outcome: stable IR; other students added passes without mystery failures.',
  ),
  S(
    'Performance story',
    'Requirement: optimization wins must show on real student programs.',
    'Goal: benchmark constant folding + DCE on representative inputs.',
    'Steps: fixed benchmark suite; idempotent passes; document IR after each pass.',
    'Outcome: measurable speedups on targets; reproducible in classroom demos.',
  ),
]

const NSBE = [
  S(
    'NSBE Gen-Sec + partnerships',
    'Role: NSBE — General Secretary, Jan 2025–present, Grambling State University.',
    'Goal: grow technical membership; convert sponsor conversations into funded programs.',
    'Plan: officer alignment from member surveys; sponsor packets with attendance + outcomes; recurring technical events.',
    'Outcome: 300+ members; ~$3K technical partnerships (resume figure); higher CS engagement vs prior term.',
  ),
  S(
    'Cross-officer conflict',
    'Conflict: officers split on hackathons vs corporate sessions vs K-12 outreach.',
    'Goal: single quarterly roadmap with measurable targets.',
    'Resolution: attendance data + survey; map sponsor dollars to dated events; vote written priority list in meeting.',
    'Outcome: fewer debate loops; execution tracked to agreed metrics.',
  ),
  S(
    'Engineering identity',
    'Member need: interview prep + technical projects — not generic PD.',
    'Goal: NSBE = CS interview prep hub on campus.',
    'Programming: DSA workshops; intro system design; internship pipeline sessions aligned to real loops.',
    'Outcome: higher CS attendance and retention vs non-technical programming.',
  ),
]

const COLORSTACK = [
  S(
    'ColorStack hackathon win',
    'Event: ColorStack Winter Hackathon 2024 — ~1,000 participants worldwide.',
    'Goal: MVP + demo script with zero live-integration failure on stage.',
    'Execution: scope freeze day one; FE/BE owners; rehearsed demo; fallback if API unstable.',
    'Outcome: 1st place Winter 2024; demo completed without outage.',
  ),
  S(
    'Community leverage',
    'Use: structured peer + mentor feedback on portfolio depth.',
    'Goal: translate feedback into concrete repo and resume edits before screens.',
    'Actions: code review sessions; metric-backed resume bullets; mock behavioral tied to shipped work.',
    'Outcome: higher recruiter response rate (tracked in personal spreadsheet).',
  ),
  S(
    'Balance with coursework',
    'Constraint: Dean’s List, Presidential Scholarship, and hackathon deadlines in the same academic term.',
    'Goal: ship a defensible demo without losing scholarship GPA.',
    'Method: fixed scope budget before the hackathon; reuse UI modules across projects; hard feature freeze in the final 12 hours.',
    'Outcome: demos delivered on schedule; GPA stayed within scholarship requirements.',
  ),
]

const EDU = S(
  'Grambling CS foundation',
  'Emmanuel Acheampong — B.S. Computer Science, Grambling State University, expected May 2027. Honors: Dean’s List 2024–2025; Presidential Scholarship; Vanda African Math Olympiad 2018 — Gold. Coursework: OOP, Software Engineering, Data Structures & Algorithms, Operating Systems.',
  'Thesis for interviews: pair coursework with production-style engineering — internships plus shipped projects with measurable outcomes.',
  'Evidence: Geaux Network + Hubtel internships; MedDiagnose AI; VisualizeMyAlgorithm; Mini-Compiler — each ties algorithms/systems concepts to metrics users or ops can see.',
  'Default: ship with tests, traceability, and quantified impact — not “it compiles on my machine.”',
)

const MOTIVE = [
  S(
    'Impact + systems',
    'Selection criteria: work must tie to measurable outcomes — latency, availability, correctness, clinical or financial KPIs.',
    'Stack fit: backend + data + full-stack depth like Geaux (gRPC, protobuf, RBAC), Hubtel (Kafka, MQTT, Postgres, Firebase), MedDiagnose (clinical ML + React).',
    'Questions for [company]: which services own revenue or safety paths; team SLOs; how success is defined in year one.',
    'Why hire me: I already shipped under those constraints; I want the same class of problem at larger scale.',
  ),
  S(
    'Growth vector',
    'Learning mode: production constraints — schema migration, idempotency, failure domains — not tutorial CRUD.',
    'Target team: rigorous review, on-call reality, explicit cross-team contracts.',
    'Track record: chose internships/projects that forced distributed systems, production ML tradeoffs, compiler-level correctness.',
    '5-year aim: own critical service boundaries + mentor on testing and incident response.',
  ),
  S(
    'Mission + craft',
    'Non-negotiables: tests, observability, inclusive UX for real users — healthcare and payments proved “works locally” is insufficient.',
    'Alignment: RBAC + logging + accessibility at Geaux; honest ML framing + workflow KPIs at MedDiagnose.',
    'Question to employers: how do you balance ship velocity with incident budget and accessibility requirements?',
    'Desired culture: correctness and auditability are part of delivery — not a backlog afterthought.',
  ),
]

const JUDGE = [
  S(
    'Production change discipline',
    'Trigger: Friday afternoon prod change request — often high urgency, unclear severity.',
    'Decision checklist: (1) Active user/revenue impact? (2) Blast radius? (3) Rollback plan? (4) On-call available? (5) Feature-flaggable minimal fix?',
    'If severity unclear: ship smallest reversible change or defer to Monday with incident ticket + named owner.',
    'Precedent: same checklist reduced risky deploys at Geaux and Hubtel.',
  ),
  S(
    'MedDiagnose lesson: trust',
    'Stakeholder tension: ML metrics weaker than “AI headline” expectations.',
    'Message: RF stroke-risk ~45% — decision support only; pair with workflow KPI: ~35% faster time-to-treatment in pilot.',
    'Delivery: written summary for clinical leads + demo of human-in-the-loop checkpoints.',
    'Result: pilot continued under informed consent; no silent over-reliance on model score.',
  ),
  S(
    'Evidence over noise',
    'Pattern: downstream symptom (e.g. DB pressure) masking upstream cause (broker backpressure, deserialization).',
    'Rule: trace Kafka → MQTT → Postgres with logs and tests before editing hot code.',
    'Hubtel outcome: fewer repeat incidents after fixing upstream batching vs repeated DB restarts.',
    'Applies to Friday hotfix: end-to-end trace first, patch second.',
  ),
]

const data = [
  { id: 1, category: 'Background', question: 'Tell me about yourself.', stories: [EDU, GEAUX_CH[0], HUBTEL[0]] },
  {
    id: 2,
    category: 'Conflict & Communication',
    question: 'Tell me about a time you had a disagreement with your manager.',
    stories: [GEAUX_CH[0], HUBTEL[1], NSBE[1]],
  },
  {
    id: 3,
    category: 'Conflict & Communication',
    question: 'Tell me about a situation when you had a conflict with a teammate.',
    stories: [GEAUX_CH[0], HUBTEL[1], COLORSTACK[0]],
  },
  {
    id: 4,
    category: 'Failure & Growth',
    question: 'Tell me about a time you failed. How did you deal with the situation?',
    stories: [MED[1], COMPILER[1], GEAUX_CH[1]],
  },
  {
    id: 5,
    category: 'Leadership',
    question: 'Describe a time when you led a team. What was the outcome?',
    stories: [NSBE[0], MED[0], VIZ[0]],
  },
  {
    id: 6,
    category: 'Pressure & Resilience',
    question: 'Tell me about a time you worked well under pressure.',
    stories: [COLORSTACK[0], GEAUX_CH[2], HUBTEL[0]],
  },
  {
    id: 7,
    category: 'Decision Making',
    question: 'Provide an example of a time when you had to make a difficult decision.',
    stories: [GEAUX_CH[0], MED[1], HUBTEL[0]],
  },
  {
    id: 8,
    category: 'Initiative',
    question: 'Describe a time when you went above and beyond the requirements for a project.',
    stories: [GEAUX_CH[2], HUBTEL[1], VIZ[1]],
  },
  {
    id: 9,
    category: 'Learning & Adaptability',
    question: "How do you handle a situation where you don't know the answer to a question?",
    stories: [GEAUX_CH[1], HUBTEL[0], COMPILER[1]],
  },
  {
    id: 10,
    category: 'Feedback',
    question: 'Describe a time you received tough or critical feedback.',
    stories: [
      S(
        'Service-layer maintainability',
        'Problem (Geaux): gRPC/protobuf code passed tests but was hard to extend — unclear module boundaries and error semantics for RPC callers.',
        'Goal: make protobuf packages and failures obvious to the next engineer.',
        'Steps: reorganize .proto packaging; add contract tests at RPC boundary; document error codes and retry expectations for consumers.',
        'Outcome: faster reviews; fewer integration surprises on the next features.',
      ),
      S(
        'ML calibration reality check',
        'Problem: MedDiagnose dashboard led with raw ~45% RF accuracy — mentors flagged that non-technical readers would misinterpret it as diagnostic certainty.',
        'Goal: align reporting with how clinicians decide (workflow + calibration), not leaderboard metrics.',
        'Steps: add calibration / confusion context in UI copy; lead with time-to-treatment and pilot workflow KPIs; demote headline accuracy.',
        'Outcome: dashboard used in rounds; clinicians engaged because risk was framed correctly.',
      ),
      S(
        'Compiler scope creep',
        'Problem: Mini-Compiler — I added optimization passes before lexer/parser tests covered edge tokens; reviewer flagged premature optimization.',
        'Goal: stabilize parse → IR before measuring optimization wins.',
        'Steps: freeze IR optimizations; expand lexer/parser regression suite; re-enable optimizations with before/after benchmarks.',
        'Outcome: stable compiler baseline; optimizations became credible and reproducible.',
      ),
    ],
  },
  {
    id: 11,
    category: 'Feedback',
    question: 'Describe a time when you had to give someone difficult feedback. How did you handle it?',
    stories: [
      S(
        'Peer tests at Hubtel',
        'Problem: Teammate opened PR on Spring service; integration tests skipped a payment edge case I had seen fail in staging.',
        'Goal: block merge on evidence, not opinion — without personal attack.',
        'Steps: reproduce with Postman + attach logs; propose JUnit + Testcontainers case for that path; frame as shared quality bar.',
        'Outcome: tests added; PR merged; regression guarded.',
      ),
      S(
        'NSBE officer workload',
        'Problem: Officer over-promised event attendance; sponsors and volunteers burned when numbers missed.',
        'Goal: reset expectations with data — private 1:1, respectful tone.',
        'Steps: show attendance vs promised; propose smaller committed events; separate critique of numbers from strengths (marketing).',
        'Outcome: next quarter hit sponsor-facing targets without volunteer burnout.',
      ),
      S(
        'Hackathon scope',
        'Problem: ColorStack Winter — teammate wanted live ML API with <12h left; integration risk too high for demo.',
        'Goal: stable demo path + honest technical story.',
        'Steps: mock inference boundary; record golden outputs; rehearse failover.',
        'Outcome: on-time submission; winning demo with no live flake.',
      ),
    ],
  },
  {
    id: 12,
    category: 'Prioritisation',
    question: 'Tell me about a time when you had to prioritize your tasks quickly.',
    stories: [GEAUX_CH[0], HUBTEL[0], COLORSTACK[2]],
  },
  {
    id: 13,
    category: 'Problem Solving',
    question: 'Describe a time when you anticipated potential problems and developed preventive measures.',
    stories: [GEAUX_CH[2], HUBTEL[1], MED[2]],
  },
  {
    id: 14,
    category: 'Stakeholder Management',
    question: 'Describe a situation where you had to deal with a difficult customer or stakeholder.',
    stories: [MED[1], GEAUX_CH[0], NSBE[2]],
  },
  {
    id: 15,
    category: 'Failure & Growth',
    question: 'Tell me about a time when you missed a deadline. What happened, and how did you handle it?',
    stories: [
      S(
        'Compiler milestone slip',
        'Problem: Public Mini-Compiler release promised optimizations; lexer tests incomplete — demo failed on rare tokenization input.',
        'Goal: restore trust + ship stable artifact quickly.',
        'Steps: notify stakeholders same day; defer non-critical optimizations; hotfix branch after lexer tests green.',
        'Outcome: stable release within days; process change — no public date without test gate.',
      ),
      MED[1],
      GEAUX_CH[1],
    ],
  },
  {
    id: 16,
    category: 'Pressure & Resilience',
    question: 'Describe a time when your workload was heavy and how you handled it.',
    stories: [COLORSTACK[2], GEAUX_CH[2], NSBE[0]],
  },
  {
    id: 17,
    category: 'Learning & Adaptability',
    question: 'Tell me about a time when you had to deal with a significant change at work. How did you adapt?',
    stories: [GEAUX_CH[1], HUBTEL[0], MED[2]],
  },
  {
    id: 18,
    category: 'Initiative',
    question: 'Describe a situation where you saw a problem and took the initiative to correct it rather than waiting for someone else.',
    stories: [GEAUX_CH[2], HUBTEL[1], VIZ[0]],
  },
  {
    id: 19,
    category: 'Conflict & Communication',
    question: 'Describe a time when there was a conflict within your team. How did you help resolve it? Did you do anything to prevent it in future?',
    stories: [GEAUX_CH[0], NSBE[1], COLORSTACK[0]],
  },
  {
    id: 20,
    category: 'Learning & Adaptability',
    question: 'Describe a time when you went out of your comfort zone. Why did you do it? What lessons did you learn?',
    stories: [GEAUX_CH[1], HUBTEL[0], MED[0]],
  },
  {
    id: 21,
    category: 'Pressure & Resilience',
    question: 'Describe a time when you delivered a project under a tight deadline.',
    stories: [COLORSTACK[0], GEAUX_CH[0], MED[0]],
  },
  {
    id: 22,
    category: 'Failure & Growth',
    question: 'Describe a time when you took a big risk and it failed.',
    stories: [MED[1], COMPILER[0], GEAUX_CH[1]],
  },
  {
    id: 23,
    category: 'Design & Product',
    question: "How would you design or test a product to make sure it's diverse and inclusive to all users?",
    stories: [
      S(
        'RBAC + a11y baseline',
        'Problem: Creator vs admin UIs depend on gRPC permissions — keyboard and screen-reader paths must match role capabilities.',
        'Goal: inclusive acceptance criteria before merge — not a late QA pass.',
        'Steps: define test matrix (role × critical flow); run a11y checks on RPC-backed screens; block merge on restricted-role failures.',
        'Outcome: caught permission + a11y gaps in QA; reduced production-only failures.',
      ),
      MED[2],
      VIZ[2],
    ],
  },
  {
    id: 24,
    category: 'Communication',
    question: 'Describe a time you had to explain a complex technical concept to someone non-technical.',
    stories: [MED[1], GEAUX_CH[0], VIZ[2]],
  },
  {
    id: 25,
    category: 'Conflict & Communication',
    question: 'Tell me about a time you disagreed with a colleague. How did you handle the situation?',
    stories: [GEAUX_CH[0], HUBTEL[1], NSBE[1]],
  },
  {
    id: 26,
    category: 'Collaboration',
    question: 'Give an example of a time you had to collaborate effectively with a team from a different department.',
    stories: [GEAUX_CH[0], MED[0], NSBE[0]],
  },
  {
    id: 27,
    category: 'Technical',
    question: "Tell me about a complex technical project you've worked on.",
    stories: [GEAUX_CH[1], HUBTEL[0], MED[0]],
  },
  {
    id: 28,
    category: 'Technical',
    question: 'How do you stay up-to-date with the latest technological advancements?',
    stories: [
      S(
        'Hands-on with real stacks',
        'Situation: new frameworks ship constantly; passive tutorials do not predict whether something works in my codebase.',
        'Task: only adopt tech I can validate in a repo I own.',
        'Action: follow release notes for stacks in use (gRPC/protobuf, Kafka, React, TensorFlow); spike in VisualizeMyAlgorithm or Mini-Compiler branch; benchmark; adopt or reject with numbers.',
        'Result: fewer dead-end dependencies; learning time tied to measured impact.',
      ),
      S(
        'Papers + practice',
        'Situation: ML papers optimize leaderboard metrics; hospital pilot (MedDiagnose) penalizes wrong assumptions about data and workflow.',
        'Task: evaluate research by deployability, not abstract score.',
        'Action: checklist each paper — training vs deployment distribution, failure modes, inference cost, monitoring needs.',
        'Result: research reading filtered to ideas that survive real constraints.',
      ),
      S(
        'Community signal',
        'Situation: interview focus shifts by season and company; solo grind wastes time on low-yield topics.',
        'Task: align study backlog with recent real interview signal.',
        'Action: NSBE + ColorStack peers share system-design prompts and company-specific rounds; I track topics in a spreadsheet and reprioritize weekly.',
        'Result: prep hours concentrated on high-frequency questions.',
      ),
    ],
  },
  {
    id: 29,
    category: 'Technical',
    question: 'Give an example of a time you had to debug a challenging technical issue.',
    stories: [
      S(
        'gRPC contract mismatch',
        'Symptom: HTTP 500s after protobuf field rename.',
        'Root cause: client and server generated from different .proto / dependency versions.',
        'Fix: git history on .proto; pin protoc + plugin versions in CI; contract test fails build if codegen stale.',
        'Outcome: eliminated silent stub drift class of outages.',
      ),
      HUBTEL[0],
      COMPILER[1],
    ],
  },
  {
    id: 30,
    category: 'Motivation',
    question: 'Why are you interested in working at [company name]?',
    stories: MOTIVE,
  },
  {
    id: 31,
    category: 'Design & Product',
    question: 'Assume you are given a task to design a system. How would you do it? How would you resolve ambiguity?',
    stories: [
      S(
        'Clarify SLOs and boundaries',
        'Step 1 — Non-functionals: latency target, durability, consistency model, compliance (PII, audit).',
        'Step 2 — User journeys: failure modes if each step is wrong.',
        'Step 3 — Architecture sketch: data flow diagram; trust boundaries (RBAC); choose REST vs gRPC vs events from coupling + scale (Geaux/Hubtel pattern).',
        'Deliverable: 1–2 page design note for review before implementation.',
      ),
      MED[2],
      HUBTEL[0],
    ],
  },
  {
    id: 32,
    category: 'Collaboration',
    question: 'Have you ever been in a situation where another team and yours were creating a similar product? What happened?',
    stories: [
      S(
        'Geaux overlap risk',
        'Problem: engineering + content each built overlapping “audit” UIs — duplicate work + inconsistent UX.',
        'Decision: single Change History product; one owner for roadmap.',
        'Actions: merge requirements; shared protobuf event contracts; deprecate duplicate prototype.',
        'Outcome: one user-facing story; zero duplicate backend integration for same feature.',
      ),
      MED[0],
      NSBE[1],
    ],
  },
  {
    id: 33,
    category: 'Technical',
    question: 'What is the biggest technical challenge you have worked on?',
    stories: [HUBTEL[0], MED[0], GEAUX_CH[1]],
  },
  {
    id: 34,
    category: 'Motivation',
    question: 'Why do you want to change your current company?',
    stories: MOTIVE,
  },
  {
    id: 35,
    category: 'Decision Making',
    question: 'Tell me a time when you had a different opinion than the rest of the team. How did you handle it?',
    stories: [GEAUX_CH[0], MED[1], HUBTEL[0]],
  },
  {
    id: 36,
    category: 'Problem Solving',
    question: 'Tell me about a time when you were faced with a problem that had a number of possible solutions. What was the problem and how did you determine the course of action?',
    stories: [GEAUX_CH[0], HUBTEL[0], VIZ[1]],
  },
  {
    id: 37,
    category: 'Leadership',
    question: 'Describe a time when you needed to motivate a group of individuals or encourage collaboration during a particular project.',
    stories: [NSBE[0], COLORSTACK[0], MED[0]],
  },
  {
    id: 38,
    category: 'Learning & Adaptability',
    question: 'What do you do to enhance your technical knowledge apart from your project work?',
    stories: [
      S(
        'Structured fundamentals',
        'Bridge: map OS/DSA coursework to production (e.g. Kafka backpressure ↔ queueing theory; gRPC deadlines ↔ RPC semantics).',
        'When stuck: re-read primary sources (OS text, papers) before random Stack Overflow.',
        'Cadence: after each internship incident, log “textbook concept → symptom” in notes.',
        'Outcome: faster root-cause analysis on unfamiliar stacks.',
      ),
      S(
        'Open source reading',
        'Target: production gRPC/Java/Kafka repos — not tutorial repos.',
        'Technique: read error handling, .proto versioning policy, module layout; reproduce minimal bug in fork.',
        'Apply: import idioms into Geaux code — cite precedent in PR description.',
        'Outcome: fewer one-off patterns; reviews cite prior art.',
      ),
      S(
        'Mentor feedback',
        'Input sources: ColorStack + NSBE mentors — resume, tests, interview framing.',
        'Process: each critique → single actionable ticket (e.g. add 3 JUnit cases for payment path; rewrite bullet with metric).',
        'Tracking: spreadsheet of feedback → done/not done.',
        'Outcome: interview answers anchored to shipped work + numbers.',
      ),
    ],
  },
  {
    id: 39,
    category: 'Prioritisation',
    question: "How do you prioritize your workload? What do you do when your work feels like it's just too much to get done?",
    stories: [GEAUX_CH[0], NSBE[1], COLORSTACK[2]],
  },
  {
    id: 40,
    category: 'Achievement',
    question: "What's the number one accomplishment you're most proud of?",
    stories: [MED[0], NSBE[0], VIZ[0]],
  },
  {
    id: 41,
    category: 'Pressure & Resilience',
    question: 'Tell me about a time when you had an excessive amount of work and you knew you could not meet the deadline. How did you manage?',
    stories: [
      S(
        'Scope negotiation',
        'Conflict: Geaux release deadline overlapped final exams; full RBAC matrix not finishable.',
        'Goal: ship security-critical paths; defer non-blocking edge cases with written plan.',
        'Steps: table of RPC methods × roles; classify must-ship vs next sprint; get manager sign-off; no Friday deploy without checklist green.',
        'Outcome: critical protections merged; remainder scheduled; trust preserved via transparent scope cut.',
      ),
      COLORSTACK[2],
      NSBE[1],
    ],
  },
  {
    id: 42,
    category: 'Learning & Adaptability',
    question: "What will be your course of action if you are assigned a task you don't know at all?",
    stories: [GEAUX_CH[1], HUBTEL[0], COMPILER[1]],
  },
  {
    id: 43,
    category: 'Failure & Growth',
    question: 'Give an example of when you took a huge risk and failed.',
    stories: [MED[1], COMPILER[1], GEAUX_CH[1]],
  },
  {
    id: 44,
    category: 'Prioritisation',
    question: 'Describe a time when you had to work simultaneously on both high-priority urgent projects as well as long-term projects. How did you handle both?',
    stories: [HUBTEL[0], GEAUX_CH[2], NSBE[0]],
  },
  {
    id: 45,
    category: 'Conflict & Communication',
    question: 'Tell me about a time when you had a hard time working with someone in your team. How did you handle it?',
    stories: [
      S(
        'Async communication drift',
        'Problem: remote teammate and I interpreted protobuf fields differently — duplicate Change History API work.',
        'Goal: single source of truth for the contract.',
        'Actions: 30-minute pairing; screen-shared .proto; added field-level comments; locked semantics with one golden-path test.',
        'Result: duplicate work stopped; future changes referenced same test.',
      ),
      NSBE[1],
      HUBTEL[1],
    ],
  },
  {
    id: 46,
    category: 'Failure & Growth',
    question: "Tell me about a project that didn't go according to plan.",
    stories: [MED[1], COMPILER[1], GEAUX_CH[1]],
  },
  {
    id: 47,
    category: 'Learning & Adaptability',
    question: "What is something new that you've learned recently?",
    stories: [
      S(
        'Finer-grained Firebase tuning',
        'Learning (Hubtel): push latency depends on batching rules, token lifecycle, and Firebase priority channels — not one API call.',
        'Goal: hit sub-10ms only where physically possible; document limits to PMs.',
        'Method: read Firebase docs on priorities; device-side traces for delivery path; table of measured p50/p95.',
        'Result: team stopped promising impossible latency; fewer false “push is broken” tickets.',
      ),
      S(
        'TensorFlow serving constraints',
        'Learning (MedDiagnose): train-time tensor shape can drift from serve-time requests — silent scoring errors.',
        'Goal: fail fast on bad inputs before model call.',
        'Method: pydantic / JSON schema on FastAPI ingress for feature vector shape and dtype.',
        'Result: fewer unexplained scores in pilot; easier debugging.',
      ),
      S(
        'gRPC interceptors',
        'Problem (Geaux): RBAC checks duplicated across handlers — risk of missing one endpoint.',
        'Goal: centralize authorization for gRPC services.',
        'Method: prototype ServerInterceptor; roll out to high-risk RPCs first; regression matrix creator vs admin.',
        'Result: auth logic auditable in one module; duplicate guards removed.',
      ),
    ],
  },
  {
    id: 48,
    category: 'Decision Making',
    question: 'Tell me about a time when you had to make a decision without all the information you needed.',
    stories: [GEAUX_CH[0], MED[1], HUBTEL[0]],
  },
  {
    id: 49,
    category: 'Problem Solving',
    question: 'Tell me a time when you linked two or more problems together and identified an underlying issue.',
    stories: [
      S(
        'Downtime symptoms vs root cause',
        'Symptom: DB alerts and slow queries. Correlation: MQTT broker backoff under publish bursts → Kafka consumer lag → DB write stalls.',
        'Hypothesis: root cause upstream of Postgres.',
        'Verification: aligned metrics timeline — Kafka lag, MQTT rate, PG connections; fix batching and consumer parallelism at source.',
        'Result: ~40% MTTD improvement (team metric); stopped restart-only “fixes”.',
      ),
      GEAUX_CH[0],
      VIZ[1],
    ],
  },
  {
    id: 50,
    category: 'Decision Making',
    question: 'Tell me about a time you made a decision to sacrifice short-term gain for a longer-term goal.',
    stories: [
      S(
        'Tests before features',
        'Tradeoff: ship new VisualizeMyAlgorithm visuals fast vs fix state-management debt causing frame drops on large graphs.',
        'Decision: delay feature splash; invest in perf foundation first.',
        'Actions: per-tick batching; memoization; CI perf budget gate before new viz merges.',
        'Result: stable demos for Dijkstra / A* / Minimax; fewer production performance bugs.',
      ),
      MED[1],
      GEAUX_CH[0],
    ],
  },
  {
    id: 51,
    category: 'Judgment',
    question: 'How would you respond if you were the last member of the team in the office on a Friday afternoon and the product owner asks you to develop and deploy a change to production?',
    stories: JUDGE,
  },
  {
    id: 52,
    category: 'Motivation',
    question: 'Where do you see yourself in 5 years?',
    stories: [
      S(
        'Staff-shaped ownership',
        '5-year target: own critical service boundaries — API design, SLOs, incident process, cross-team contracts.',
        'Evidence bar: metrics + design docs + mentored engineers shipping safely.',
        'Path: deepen same mix as Geaux + Hubtel + MedDiagnose (backend, data, regulated UX) at larger scale.',
        'Anti-goal: heroics — goal is fewer pages, not more medals.',
      ),
      MOTIVE[1],
      MOTIVE[0],
    ],
  },
  {
    id: 53,
    category: 'Motivation',
    question: 'What does your best day of work look like?',
    stories: [
      S(
        'Deep work + shipping',
        'Definition of a good day: (1) merged change with tests green; (2) one deep dive — profile, trace, or RCA; (3) one knowledge transfer — PR review or pairing.',
        'Balance: solo focus blocks + team unblocking — same day.',
        'Reference pattern: Geaux / Hubtel on-call days.',
        'End state: at least one measurable improvement — latency, coverage, or customer-visible fix shipped.',
      ),
      MOTIVE[0],
      VIZ[2],
    ],
  },
  {
    id: 54,
    category: 'Communication',
    question: 'What words would your colleagues use to describe you?',
    stories: [
      S(
        'Rigorous tester',
        'At Hubtel, people knew I’d push back if money-moving flows didn’t have real integration tests.',
        'I’d rather slow a merge than ship blind.',
        'JUnit and Postman weren’t glamorous, but they ended arguments.',
        'I hear “thorough” a lot in feedback—I will take it.',
      ),
      S(
        'Systems thinker',
        'At Geaux, teammates asked me to trace protobuf contracts across services when things got fuzzy.',
        'I like drawing the system before I code.',
        'I sketch flows, retries, idempotency—what breaks for creators vs admins—so we don’t discover it in prod.',
        'People say I make the scary parts smaller before they blow up.',
      ),
      S(
        'Mission-driven',
        'In NSBE and ColorStack I think people would say I show up with a plan—not just energy.',
        'I care about logistics, not only speeches.',
        'RSVP targets, sponsor deliverables, workshops that match what interviews actually ask.',
        'We hit attendance goals and members actually land opportunities—that’s the point.',
      ),
    ],
  },
  {
    id: 55,
    category: 'Initiative',
    question: 'What is something that you had to push for in your previous projects?',
    stories: [GEAUX_CH[2], HUBTEL[1], VIZ[0]],
  },
  {
    id: 56,
    category: 'Initiative',
    question: 'What would you hope to achieve in the first six months after being hired?',
    stories: [
      S(
        'Ramp + ownership',
        '30 / 60 / 180 day plan: (0–30) ship small fixes — learn build, deploy, on-call; (30–90) own one service or pipeline with defined SLO; (180) lead one cross-team reliability or test initiative.',
        'Success metric: measurable latency, error rate, or MTTD improvement — not ticket count.',
        'Reference: same ramp pattern at Geaux on gRPC/protobuf.',
        'Deliverable by month 6: written postmortem or design note with metrics showing improvement.',
      ),
      S(
        'Relationships',
        'Stakeholder map (week 1–2): security, product, SRE/support — agree incident comms channels and SLAs.',
        'MedDiagnose parallel: short weekly async updates to clinical contacts; documented risks.',
        'Goal: no surprise escalations — status visible when healthy.',
        'Payoff: faster incident resolution when trust pre-exists.',
      ),
      S(
        'Testing culture',
        'Target: RPC + event pipeline contract tests and flaky-test burn-down in Q1.',
        'Why: highest cost bugs — silent data corruption and pipeline drift.',
        'Actions: prioritize top flaky tests; add gRPC contract tests in CI; document ownership per suite.',
        'Metric: reduce flaky CI rate + increase coverage on critical paths.',
      ),
    ],
  },
  {
    id: 57,
    category: 'Achievement',
    question: 'If this were your first annual review, what would I be telling you right now?',
    stories: [
      S(
        'Ship + measure',
        'If this were my first review, you’d probably say: you shipped real stuff across TypeScript, Java and gRPC, and data pipelines—and you could point to numbers: roughly 40% better downtime detection at Hubtel, big reliability gains where we invested tests, and about 35% faster time-to-treatment in the MedDiagnose pilot.',
        'That’s a strong start for where I am in my career.',
        'The growth edge is estimation and communication across teams—owning timelines without sandbagging or overpromising.',
        'Next step is bigger ownership with clearer SLOs and helping others on test design, not just my own code.',
      ),
      NSBE[0],
      COLORSTACK[0],
    ],
  },
  {
    id: 58,
    category: 'Learning & Adaptability',
    question: 'What is your biggest strength and area of growth?',
    stories: [
      S(
        'Strength: end-to-end debugging',
        'I’m pretty calm when things break across protobuf, Kafka and MQTT, and the UI—I’ve done that at Hubtel and Geaux.',
        'Where I’m growing is knowing when to pull someone in earlier.',
        'I can over-investigate before I escalate; I’m working on time-boxing and giving leads a tight summary with what I’ve ruled out.',
        'They get signal sooner, and I still finish the fix—I’m not dropping the ball.',
      ),
      S(
        'Strength: responsible ML framing',
        'MedDiagnose taught me to talk about ML next to workflow outcomes, not a single accuracy number.',
        'I want more depth in real MLOps—not just training notebooks.',
        'I’m reading more about drift monitoring and what retraining looks like when you’re not in a classroom.',
        'I’m closing that gap with side projects and coursework where I can.',
      ),
      S(
        'Strength: community leadership',
        'NSBE is proof I can execute—membership growth, real sponsor dollars.',
        'I’m still learning to delegate so it doesn’t all ride on me.',
        'I’m trying to build other leaders, not only run events myself.',
        'The win is when programs keep working even when I’m slammed with school.',
      ),
    ],
  },
  {
    id: 59,
    category: 'Learning & Adaptability',
    question: 'What aspects of your work are most often criticized?',
    stories: [
      S(
        'Over-engineering risk',
        'I’ve been called out for reaching for abstractions too early—I get excited about clean design.',
        'I’m learning to prove the need with data first.',
        'Now I try the smallest change that meets the SLO, and only refactor when the pattern repeats.',
        'PRs move faster and people spend less time debating architecture in the abstract.',
      ),
      S(
        'Estimation optimism',
        'Compiler and viz projects taught me pretty visuals can hide a week of integration pain.',
        'I’m getting better at padding estimates for unknowns.',
        'I slice work vertically so there’s something demoable sooner.',
        'Stakeholders get fewer “surprise, we need another sprint” moments.',
      ),
      S(
        'Async updates',
        'Remote work means nobody sees you thinking—mentors told me I need to over-communicate status.',
        'I’m working on smaller, more frequent updates.',
        'Short standup notes or doc updates when something shifts.',
        'Managers stopped pinging me for “where are we?” because it’s already written down.',
      ),
    ],
  },
  {
    id: 60,
    category: 'Stakeholder Management',
    question: "Tell me about a time you needed information from someone who wasn't responsive.",
    stories: [
      S(
        'Blocked on proto review',
        'A senior engineer had my protobuf review sitting, and my Geaux feature was stuck behind it.',
        'I couldn’t spam them, but I couldn’t wait forever either.',
        'I sent a tight summary of the diff, listed exact questions, and offered two short slots. If it slipped past what we’d agreed, I escalated with facts—who was blocked downstream.',
        'The review landed, and they actually thanked me for making it easy to consume.',
      ),
      S(
        'Clinical feedback loop',
        'During finals, neurologists weren’t answering MedDiagnose UX questions fast—and honestly, their time is more valuable than mine.',
        'I needed answers without being annoying.',
        'I batched questions, sent screenshots, and used short Loom videos so they could respond async.',
        'We got what we needed without burning bridges.',
      ),
      S(
        'Sponsor contact ghosting',
        'For NSBE, a sponsor contact went quiet right when we needed a yes on budget so we could book travel.',
        'I needed an answer without sounding desperate.',
        'I sent a short email with two clear options—commit by this date or pause—and only looped a faculty advisor when it was fair.',
        'We got a decision in time to book or pivot to another sponsor without drama.',
      ),
    ],
  },
  {
    id: 61,
    category: 'Judgment',
    question: 'What frustrates you?',
    stories: [
      S(
        'Opaque incidents',
        'Nothing frustrates me more than a postmortem that says “fixed” with no root cause and no follow-up tests.',
        'If we don’t learn, we’ll see the same fire again.',
        'At Hubtel I pushed for a real timeline, what actually failed, and what test would catch it next time—not just “we restarted it.”',
        'Once we fixed upstream backpressure instead of blaming Postgres, repeat noise dropped.',
      ),
      S(
        'Vanity metrics',
        'Shipping features with no definition of success drives me nuts—if we can’t point to latency, errors, or a user outcome, what are we doing?',
        'I want work tied to something measurable.',
        'On MedDiagnose I’d rather talk about time-to-treatment than a pretty slide.',
        'Teams move faster when everyone agrees what “good” means.',
      ),
      S(
        'Gatekeeping',
        'I get frustrated by communities that make beginners feel dumb—that’s a big reason I care about NSBE and ColorStack.',
        'Gatekeeping wastes talent.',
        'I help run intro workshops—DSA basics, git hygiene—so people have a real on-ramp.',
        'Retention goes up when people feel invited, not tested for coolness.',
      ),
    ],
  },
  {
    id: 62,
    category: 'Judgment',
    question: 'What is something 90% of people disagree with you about?',
    stories: [
      S(
        'Move slow to move fast',
        'A lot of people want to hotfix on Friday and call it heroism. I’d rather ship a boring, tested change Monday.',
        'Tail risk matters more than adrenaline.',
        'Hubtel and MedDiagnose both taught me untested hotfixes come back as outages.',
        'I’d rather be the person who sleeps and keeps prod stable.',
      ),
      S(
        'Accuracy is not enough in ML',
        'Hackathons love leaderboard scores. I care whether the model behaves in the real workflow—calibration, when it’s wrong, how clinicians actually use it.',
        'That’s not always a popular take in a 48-hour room.',
        'I push for human-in-the-loop UX and monitoring, not a vanity metric.',
        'Clinicians buy in when you’re honest; some hackathon judges don’t love it until they see pilot numbers.',
      ),
      S(
        'Community > grind culture',
        'Some people brag about all-nighters. I don’t think that’s sustainable—or necessary.',
        'I’d rather ship consistently and stay healthy.',
        'I time-box, protect sleep during exams, and still shipped real projects at Geaux and on VisualizeMyAlgorithm.',
        'Dean’s List plus shipping beats burnout theater.',
      ),
    ],
  },
  {
    id: 63,
    category: 'Communication',
    question: 'Tell me about a time you had to deliver difficult or bad news to someone.',
    stories: [
      S(
        'Model limits to stakeholders',
        'I had to tell clinical partners the stroke risk model was sitting around 45% accuracy—that’s not what someone wants to hear if they wanted a headline “AI saves lives” story.',
        'Bad news lands better if you’re direct.',
        'I paired it with what we could prove on the workflow side—NIHSS, tPA checks, and about 35% faster time-to-treatment in the pilot.',
        'They could live with it as decision support, and the pilot kept going with clearer expectations.',
      ),
      S(
        'Sponsor shortfall',
        'NSBE had to tell a sponsor we didn’t hit the attendance we promised for an event—that’s uncomfortable.',
        'We owned it instead of making excuses.',
        'We came back with a smaller workshop, guaranteed RSVPs, and a tighter plan.',
        'They stayed with us because we didn’t hide the miss.',
      ),
      S(
        'Demo failure prep',
        'Six hours before a ColorStack deadline I told my team the live ML endpoint was too risky—we’d been fighting instability.',
        'I’d rather eat crow early than fail on stage.',
        'We stubbed inference with recorded outputs, kept the API contract stable, and rehearsed.',
        'We still won Winter 2024 out of roughly a thousand people—and the demo didn’t flake.',
      ),
    ],
  },
]

fs.writeFileSync(out, JSON.stringify(data, null, 4), 'utf8')
console.log('Wrote', out, 'questions:', data.length)
