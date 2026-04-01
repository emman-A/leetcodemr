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

// —— Dense resume-aligned story blocks (reuse across questions) ——
const GEAUX_CH = [
  S(
    'Change History: event consolidation',
    'At Geaux Network (Associate SWE Intern, May–Aug 2025, remote), engineering and content both needed auditability for edits to podcasts and media metadata, but events lived in multiple backend sources with inconsistent schemas.',
    'Ship a Change History View in TypeScript/SCSS that traced content and media changes without boiling the ocean on day one.',
    'I aligned engineering and content in one working session, ranked event sources by traceability value, and implemented a phased UI that surfaced the highest-signal protobuf-backed events first; paired that with tighter integration tests on the read path.',
    'We improved end-to-end traceability of edits across the platform and kept scope controlled so releases stayed predictable.',
  ),
  S(
    'gRPC service layer + tests',
    'The podcast stack needed a maintainable API surface: internal services were moving toward Java services exposing gRPC with Protocol Buffer contracts, and accuracy regressions were costly for ingestion and distribution.',
    'Raise data fidelity for services feeding podcast ingestion and distribution to 10,000+ monthly listeners while keeping contracts testable.',
    'I implemented and extended the service layer in Java/gRPC with protobuf definitions, added end-to-end coverage across the RPC boundary, and validated behavior against real ingestion workflows—not just happy-path unit tests.',
    'We roughly doubled measured data accuracy on the ingestion path and made downstream consumers safer to evolve.',
  ),
  S(
    'RBAC, logging, and a11y on RPC',
    'Creator and admin workflows touched sensitive operations; some RPC endpoints needed role separation, and we needed observability and accessibility signals for compliance and collaboration.',
    'Harden security and operability without blocking feature work on the Change History and related surfaces.',
    'I implemented interaction logging for critical flows, ran accessibility testing on key UI paths, and enforced role-based access control on sensitive gRPC endpoints so creator vs admin behavior stayed explicit.',
    'That reduced privilege ambiguity, improved audit posture, and made cross-team collaboration less error-prone.',
  ),
]

const HUBTEL = [
  S(
    'Kafka/MQTT/Postgres pipeline',
    'At Hubtel (SWE Intern, Jun–Sep 2023, Ghana), transaction-heavy services generated high-volume system events; downtime and delayed detection were directly tied to revenue and trust.',
    'Build observability that shortened mean time to detect issues without destabilizing payment workflows.',
    'I helped build a scalable real-time pipeline using Apache Kafka Connect, MQTT, and PostgreSQL, traced failures end-to-end from broker to sink, and validated assumptions with integration tests and metrics.',
    'Downtime detection time improved by about 40% and platform availability for payment flows got materially better.',
  ),
  S(
    'Spring Boot test expansion',
    'Payment and financial workflows needed higher confidence than a thin layer of unit tests; failures were often integration-shaped (DB, messaging, HTTP).',
    'Increase reliability of backend services supporting money movement.',
    'I wrote 20+ automated unit and integration tests with Spring Boot, JUnit, and Postman collections, focusing on transaction boundaries and failure modes—not just coverage numbers.',
    'Reliability improved on the order of 80% in the areas we targeted, and regressions became easier to catch pre-release.',
  ),
  S(
    'Firebase push latency',
    'Operations teams and users needed near-real-time status and transaction updates; slow or flaky notifications masked systemic issues.',
    'Deliver critical updates fast enough to be useful for incident response and UX.',
    'I implemented a Firebase-backed push notification path and measured end-to-end latency, tuning batching and delivery so critical signals stayed sub-10ms where the stack allowed.',
    'Users got faster awareness of state changes, which paired well with the improved pipeline observability.',
  ),
]

const MED = [
  S(
    'MedDiagnose stack + pilot',
    'MedDiagnose AI (Python, TypeScript, FastAPI, TensorFlow, React) targeted stroke workflows: real-time monitoring, NIHSS scoring, RBAC, and automated tPA eligibility checks to cut diagnostic delay.',
    'Ship a hospital-defensible pilot in Louisiana, not a demo that overclaimed ML performance.',
    'I worked across FastAPI services, React clinical UI, and model integration—framing the Random Forest risk layer honestly at ~45% accuracy while keeping the workflow valuable for neurologists.',
    'A Louisiana hospital pilot strengthened early detection and cut time-to-treatment by ~35%, improving care coordination outcomes.',
  ),
  S(
    'ML + clinical translation',
    'Blood-sample analytics used a Random Forest model for stroke-risk signals; clinicians cared about calibration, failure modes, and when to ignore the score.',
    'Make ML assistive without pretending it replaced judgment.',
    'I translated model inputs/outputs into clinician language, documented uncertainty, and wired the UI so human decision points stayed explicit.',
    'We preserved trust while still delivering automation where it mattered—routing, alerts, and eligibility prep.',
  ),
  S(
    'Full-stack reliability',
    'Real-time patient monitoring meant websocket/state issues could look like clinical issues; RBAC mistakes could leak sensitive data.',
    'Keep the stack stable under load and compliant by design.',
    'I focused on role-based access control end-to-end, structured API errors, and performance-sensitive rendering paths in React for monitoring views.',
    'The system held up in pilot conditions and matched hospital expectations on access control.',
  ),
]

const VIZ = [
  S(
    'VisualizeMyAlgorithm scale',
    'VisualizeMyAlgorithm (React.js) is an interactive algorithm visualization platform—pathfinding, sorting, and AI-style simulations—used by 1,000+ learners.',
    'Make heavy visualizations feel instant and understandable, not gimmicky.',
    'I built modular visualization components (Dijkstra, A*, Minimax, neural-net demos), dynamic state management, and a live rendering pipeline for step-by-step execution.',
    'Learners reported grasping concepts faster—about 40% faster in informal timing—and the platform sustained large concurrent sessions without frame collapse.',
  ),
  S(
    'State + performance',
    'Step-through debugging for algorithms is state-heavy; naive React patterns caused rerender storms.',
    'Keep interactions smooth for large graphs.',
    'I isolated state updates per simulation tick, memoized expensive structures, and capped work per frame so the UI stayed responsive on mid-tier laptops.',
    'That stability is why classrooms could adopt it without specialized hardware.',
  ),
  S(
    'Pedagogy + engineering',
    'The product goal was learning efficiency, not flashy graphics.',
    'Tie every animation to an invariant learners could verify.',
    'I synchronized visual state with algorithm invariants (frontier sets, relaxed edges) so users could map code to motion.',
    'That reduced “magic” and improved retention for CS fundamentals.',
  ),
]

const COMPILER = [
  S(
    'Mini-compiler engineering',
    'Mini-Compiler (C, C++, Python, Yacc) targeted developers learning compilers: lexing, parsing, IR generation, and optimizations.',
    'Ship tooling that was correct enough for classroom use and fast to iterate on.',
    'I implemented lexical analysis, parsing, intermediate code generation, constant folding, and dead-code elimination with automated error reporting.',
    '50+ developers used it; debugging time dropped ~35% versus naive edit-compile cycles in coursework.',
  ),
  S(
    'Correctness first',
    'Early versions prioritized features; subtle parser bugs cascaded into bad IR.',
    'Stabilize the pipeline before adding optimizations.',
    'I tightened grammar handling, added regression tests around edge cases, then layered optimizations once baselines were green.',
    'The compiler became teachable and trustworthy enough for others to extend.',
  ),
  S(
    'Performance story',
    'Dead code and constant folding needed to show measurable wins, not theoretical ones.',
    'Prove runtime improvements on small programs.',
    'I benchmarked before/after IR for representative snippets and kept passes idempotent where possible.',
    'Runtime and maintainability improved for the compiled programs students cared about.',
  ),
]

const NSBE = [
  S(
    'NSBE Gen-Sec + partnerships',
    'As NSBE Gen-Sec (Jan 2025–present, Grambling), the chapter needed momentum after pandemic-era engagement drops; CS majors wanted technical community, not just social events.',
    'Rebuild membership energy and secure sustainable sponsor relationships.',
    'I operationalized outreach, aligned officers on a member-first roadmap, and packaged the chapter for sponsors with clear talent and impact metrics.',
    'We grew to 300+ members and secured ~$3K in technical partnerships.',
  ),
  S(
    'Cross-officer conflict',
    'Officers split on whether to prioritize hackathons, corporate sessions, or K-12 outreach—each had vocal advocates.',
    'Convert debate into a quarterly plan with measurable outcomes.',
    'I quantified member demand (surveys + attendance), tied sponsor commitments to specific events, and sequenced initiatives so wins compounded.',
    'Execution sped up and internal friction dropped because priorities were evidence-backed.',
  ),
  S(
    'Engineering identity',
    'Many members needed interview and project support, not generic “professional development.”',
    'Make NSBE the place for technical growth at Grambling.',
    'I pushed workshop content toward DSA, system design intros, and internship pipelines—aligned with what employers actually tested.',
    'Attendance and retention improved among CS majors specifically.',
  ),
]

const COLORSTACK = [
  S(
    'ColorStack hackathon win',
    'ColorStack (member, Sep 2024–present) runs high-signal hackathons with global competition; Winter 2024 had ~1,000 participants.',
    'Ship a compelling project under clock pressure with a clear demo.',
    'Our team scoped to an achievable MVP, divided frontend/backend ownership, and rehearsed the demo path to avoid live-integration surprises.',
    'We won Winter 2024—validation that I can execute under pressure with distributed teammates.',
  ),
  S(
    'Community leverage',
    'ColorStack connects underrepresented CS talent to internships; I used it to benchmark my portfolio against strong peers.',
    'Turn membership into measurable skill growth.',
    'I used feedback loops from mentors and peer review to tighten project narratives and code quality before employer screens.',
    'That accelerated how quickly I converted outreach into interviews.',
  ),
  S(
    'Balance with coursework',
    'Hackathons and classes competed for nights and weekends.',
    'Stay competitive academically (Dean’s List ‘24/’25, Presidential Scholarship) while competing.',
    'I time-boxed hackathon scope, pre-built reusable UI kits, and refused scope creep during the final 12 hours.',
    'Shipped demos without sacrificing GPA milestones.',
  ),
]

const EDU = S(
  'Grambling CS foundation',
  'I am Emmanuel Acheampong, pursuing a B.S. in Computer Science at Grambling State University (May 2027) with Dean’s List honors (‘24, ‘25), a Presidential Scholarship, and a Vanda African Math Olympiad (2018) gold—coursework spans OOP, software engineering, DSA, and OS.',
  'Translate academic rigor into production-style engineering habits.',
  'I paired theory with internships (Geaux, Hubtel) and large projects (MedDiagnose, VisualizeMyAlgorithm, Mini-Compiler) so algorithms and systems concepts show up in measurable shipping work.',
  'That combination is why I default to traceability, tests, and metrics when I build.',
)

// Questions 30, 34, 52-53 etc. — motivation / company-agnostic
const MOTIVE = [
  S(
    'Impact + systems',
    'I gravitate to teams where code ties to observable outcomes—latency, availability, accuracy, or learning velocity—not vanity features.',
    'Pick employers whose product surface area matches backend, data, and full-stack depth I have already exercised.',
    'Geaux (gRPC/protobuf, RBAC), Hubtel (Kafka/MQTT/Postgres, Firebase), and MedDiagnose (clinical ML + React) are my reference points for that bar.',
    'I am looking for the next environment where those constraints are even sharper.',
  ),
  S(
    'Growth vector',
    'I learn fastest when production forces tradeoffs—schema evolution, idempotency, failure domains—not toy CRUD.',
    'Find teams with strong review culture and real SLOs.',
    'I have sought internships and projects that pushed me into distributed systems, ML ops realities, and compiler-level thinking.',
    'I want that slope to continue—deeper ownership on services and cross-functional delivery.',
  ),
  S(
    'Mission + craft',
    'Healthcare and fintech taught me that “it works on my machine” is not enough—auditability and correctness matter.',
    'Align with companies that invest in testing, observability, and inclusive product design.',
    'My work on RBAC, logging, accessibility testing, and responsible ML framing matches that ethos.',
    'That is the kind of team I contribute best to.',
  ),
]

const JUDGE = [
  S(
    'Production change discipline',
    'Friday afternoon deploy asks are usually urgency theater unless there is a Sev-level customer impact.',
    'Protect users and the team from unforced errors.',
    'I would verify severity, blast radius, rollback, and on-call coverage; if ambiguous, I ship a minimal reversible fix behind a flag or defer to Monday with a documented incident path.',
    'That pattern—facts before adrenaline—is what kept Hubtel/Geaux releases trustworthy.',
  ),
  S(
    'MedDiagnose lesson: trust',
    'Clinical stakeholders needed honest timelines when model metrics were weaker than hoped.',
    'Prefer transparent tradeoffs over silent risk.',
    'I communicated limits of the ~45% RF model alongside workflow wins (35% faster time-to-treatment) so leadership could decide consciously.',
    'Trust went up; we avoided the failure mode of silent ML overconfidence.',
  ),
  S(
    'Evidence over noise',
    'In event pipelines, the “bug” often looks downstream when root cause is upstream deserialization or backpressure.',
    'Separate correlation from causation before patching.',
    'At Hubtel I traced Kafka→MQTT→Postgres paths with logs and tests before touching hot paths—preventing repeat incidents.',
    'That investigative discipline is what I would bring to any prod hotfix decision.',
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
        'Early gRPC/protobuf service code I shipped at Geaux was correct in tests but hard for teammates to extend—naming and module boundaries obscured contract ownership.',
        'Absorb critique without defending ego; raise code quality for the team’s velocity.',
        'I refactored protobuf packaging, added contract tests at the RPC boundary, and documented error semantics so consumers could reason about failures.',
        'Review friction dropped and subsequent features shipped faster with fewer integration surprises.',
      ),
      S(
        'ML calibration reality check',
        'Mentors pushed back that marketing the stroke RF model by raw accuracy (~45%) misled non-technical readers.',
        'Reframe metrics responsibly.',
        'I shifted reporting to calibration plots, confusion-aware language, and workflow KPIs (time-to-treatment) instead of headline accuracy.',
        'Stakeholders trusted the dashboard more; clinicians engaged more deeply.',
      ),
      S(
        'Compiler scope creep',
        'On Mini-Compiler, a reviewer said I optimized before stabilizing parse errors—classic premature optimization.',
        'Reorder the roadmap to correctness-first.',
        'I parked IR passes until lexer/parser tests covered edge tokens; then reintroduced optimizations with benchmarks.',
        'Stability improved and the critique became moot.',
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
        'A teammate wanted to merge a Spring service change with thin integration coverage around a payment edge case I had seen fail in staging.',
        'Raise risk without attacking them personally.',
        'I reproduced the failure with a minimal Postman sequence, shared logs, and suggested a focused JUnit + Testcontainers case; framed it as shared quality bar, not blame.',
        'They expanded tests; we merged with confidence.',
      ),
      S(
        'NSBE officer workload',
        'An officer consistently over-promised event turnout, which strained sponsors and volunteers.',
        'Give candid feedback privately with data.',
        'I showed attendance trends vs. promises and proposed smaller committed events; focused on their strengths in marketing while tightening planning cadence.',
        'The next quarter hit targets without burning volunteers.',
      ),
      S(
        'Hackathon scope',
        'During ColorStack Winter, a teammate wanted a live ML API dependency we could not stabilize in 12 hours.',
        'Push back with alternatives fast.',
        'I proposed a mocked inference boundary with recorded outputs for demo reliability and documented the tradeoff for judges.',
        'We shipped on time and still told an honest technical story.',
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
        'I committed to a public release of Mini-Compiler optimizations before lexer coverage was complete; a corner-case tokenization bug slipped into demo night.',
        'Recover credibility with transparency and a fix plan.',
        'I communicated the slip immediately, shipped a hotfix branch, and cut scope on secondary features until tests green-lit.',
        'Users got a stable drop within days; I tightened estimation afterward.',
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
        'Inclusive design for me starts with permissions, keyboard paths, and screen-reader labels on critical flows—especially admin/creator splits.',
        'Bake inclusion into acceptance criteria, not a late QA pass.',
        'At Geaux I paired accessibility testing with RBAC on RPC-backed UI to catch “works for me” paths that failed for restricted roles.',
        'We caught exclusion bugs before they reached creators.',
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
        'Reading blogs without shipping is weak signal; I follow release notes for tools I actually use—gRPC/protobuf, Kafka, React concurrent features, TF/Keras changes.',
        'Convert curiosity into small experiments.',
        'I spike changes in side branches of VisualizeMyAlgorithm or compiler tooling and benchmark before adopting.',
        'That filters hype from durable improvements.',
      ),
      S(
        'Papers + practice',
        'For ML, I pair course fundamentals with competition datasets and hospital pilot constraints—what works in Kaggle often fails under clinical skew.',
        'Stay grounded.',
        'MedDiagnose forced me to track data drift and evaluation metrics beyond accuracy.',
        'I keep that discipline when reading new model architectures.',
      ),
      S(
        'Community signal',
        'NSBE/ColorStack expose me to peer stacks and internship feedback loops faster than solo study.',
        'Stress-test my roadmap.',
        'I compare notes on system design and interviewing trends with peers who just completed FAANG-style loops.',
        'That keeps my learning list employer-relevant.',
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
        'A Geaux service started 500ing after a protobuf field rename—clients and servers were on different generated stubs.',
        'Find desync without production thrash.',
        'I diffed `.proto` history, pinned dependency versions in CI, and added contract tests that fail when codegen is stale.',
        'Incidents dropped; deploys became boring—in a good way.',
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
        'Ambiguity usually means missing non-functional requirements—latency, durability, consistency, and compliance.',
        'Start with user journeys and failure modes.',
        'I draft data flows, identify trust boundaries (RBAC, PII), and pick integration patterns (REST vs gRPC vs events) based on coupling and scale—similar to Geaux/Hubtel splits.',
        'That yields a thin architecture doc everyone can critique early.',
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
        'Engineering and content both prototyped “audit” views; duplicate effort would confuse users.',
        'Merge efforts before shipping parallel UIs.',
        'We consolidated on one Change History roadmap with shared event contracts and killed duplicate prototypes.',
        'Users got one coherent story; teams avoided rework.',
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
        'Coursework in OS and DSA at Grambling complements production debugging—I map textbook concepts (locks, backpressure) to what I see in Kafka and gRPC.',
        'Keep theory and practice linked.',
        'I revisit core texts when I hit unfamiliar failure modes in internships.',
        'That makes new stacks less intimidating.',
      ),
      S(
        'Open source reading',
        'I read server implementations and protobuf/gRPC examples from real repos, not toy tutorials.',
        'Learn idioms.',
        'I diff upstream error-handling and versioning patterns, then reproduce minimal repros in branches before touching production services.',
        'My Geaux reviews moved faster because I could cite established patterns instead of inventing one-off fixes.',
      ),
      S(
        'Mentor feedback',
        'ColorStack/NSBE mentors flag blind spots—resume depth, testing discipline, communication.',
        'Close gaps deliberately.',
        'I convert feedback into concrete drills: targeted Spring/JUnit cases, tighter demo scripts, and resume bullets tied to metrics.',
        'Interview and internship conversion improved once I drilled the weak spots instead of repeating generic prep.',
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
        'During Geaux, a release window collided with final exams; I could not ship every RBAC edge case on time.',
        'Protect quality by cutting scope transparently.',
        'I documented must-have vs nice-to-have RPC protections, shipped the critical path, and scheduled the rest with my manager’s buy-in.',
        'We avoided a risky Friday deploy while preserving trust.',
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
        'A remote Geaux teammate and I interpreted protobuf field semantics differently, causing duplicate work on the Change History API.',
        'Reset shared truth.',
        'I scheduled a short pairing session, screenshared the contract, and added examples to the proto comments plus tests.',
        'Misalignment stopped recurring.',
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
        'Push latency work at Hubtel pushed me into batching semantics and device token lifecycle edge cases I had not needed before.',
        'Deepen mobile notification correctness.',
        'I read Firebase docs on priority channels and validated with device traces.',
        'Sub-10ms targets became achievable only where the stack actually allowed—learned to communicate limits.',
      ),
      S(
        'TensorFlow serving constraints',
        'MedDiagnose taught me TF model packaging pitfalls—input shape drift between train and serve.',
        'Harden serve path.',
        'I added schema validation on FastAPI ingress for feature vectors.',
        'Fewer silent scoring failures in pilot.',
      ),
      S(
        'gRPC interceptors',
        'For RBAC I learned interceptor patterns to centralize auth checks instead of scattering guards.',
        'Reduce duplication and auth bugs.',
        'I prototyped interceptors on a branch, rolled them out to the highest-risk RPCs first, and regression-tested creator vs admin paths.',
        'Authorization logic became one place to audit; we stopped duplicating checks across handlers.',
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
        'At Hubtel, alerts looked like DB issues but correlated with MQTT broker backoff under burst traffic.',
        'Find the systemic link.',
        'I correlated Kafka lag, MQTT publish rates, and Postgres write stalls to tune batching and consumer parallelism.',
        'MTTD improved ~40% once we fixed upstream—not just restarted DB.',
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
        'I delayed a flashy VisualizeMyAlgorithm release to refactor state management—short-term buzz vs sustainable FPS.',
        'Protect long-term maintainability.',
        'I batched graph updates per animation tick, memoized hot structures, and added perf budgets in CI before shipping new visualizations.',
        'Users got smoother simulations for Dijkstra/A*/Minimax demos; support noise dropped because frames no longer collapsed under load.',
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
        'I see myself as a senior/staff engineer who owns critical services end-to-end—API design, reliability, and cross-team alignment—with metrics to prove impact.',
        'Grow depth without narrowing to a silo.',
        'Geaux/Hubtel/MedDiagnose already span backend, data, and product surfaces; I want that at larger scale.',
        'That means mentoring, sharper architecture, and fewer incidents.',
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
        'Morning: green CI on a gRPC change; afternoon: profile-guided optimization or tracing review; evening: mentor a junior on test design.',
        'Balance craft and collaboration.',
        'That rhythm mirrors my best days at Geaux and Hubtel.',
        'I end tired but with measurable movement—latency down, tests up, or users unblocked.',
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
        'Peers at Hubtel saw me push integration coverage when flows touched money.',
        'Be the person who de-risks merges.',
        'JUnit/Postman evidence beat opinions.',
        '“Thorough” shows up in reviews.',
      ),
      S(
        'Systems thinker',
        'Geaux teammates relied on me to trace protobuf contracts across services.',
        'Connect dots across layers.',
        'I diagram message flows and failure domains before coding—what must be idempotent, what can retry, what breaks creators vs admins.',
        'They would say I shrink ambiguity: fewer integration surprises in review.',
      ),
      S(
        'Mission-driven',
        'NSBE/ColorStack folks describe me as consistent—showing up with data-backed plans.',
        'Community leadership.',
        'I pair vision with logistics—RSVP targets, sponsor deliverables, and workshop content that matches what hiring managers test.',
        'Execution over slogans: events hit attendance goals and members land opportunities.',
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
        'First 30 days: ship small fixes to learn build/deploy; 60–90: own a service slice with SLOs; 180: lead a cross-team improvement (observability or test gap).',
        'Convert onboarding into durable impact.',
        'Pattern matches how I ramped at Geaux with gRPC/protobuf.',
        'I want measurable reliability or latency wins, not just tickets closed.',
      ),
      S(
        'Relationships',
        'Map stakeholders—security, product, support—and establish communication norms early.',
        'Reduce future friction.',
        'I did this implicitly on MedDiagnose with clinical staff.',
        'Fewer surprises in integration and faster trust when incidents happen.',
      ),
      S(
        'Testing culture',
        'Leave the codebase with stronger contract tests than I found—especially around RPC and data pipelines.',
        'Pay it forward.',
        'I would contribute flaky-test cleanup and contract tests in my first quarter so the team’s velocity compounds.',
        'Onboarding the next engineer becomes cheaper because the safety net is real.',
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
        'You shipped production features across TypeScript, Java/gRPC, and data pipelines with quantified outcomes—40% MTTD, 80% reliability lift in targeted services, 35% faster treatment in pilot.',
        'Solid early-career trajectory.',
        'Keep investing in estimation and cross-team communication.',
        'Next level is owning larger slices with clearer SLOs and mentoring others on test design.',
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
        'I stay calm tracing failures across protobuf, Kafka/MQTT, and UI—evidence from Hubtel and Geaux.',
        'Growth: earlier escalation',
        'Sometimes I dig too deep before looping in leads; I am learning to time-box investigation and escalate with a crisp summary.',
        'Leads get signal sooner; I still own follow-through on fixes.',
      ),
      S(
        'Strength: responsible ML framing',
        'MedDiagnose taught me to pair metrics with clinical workflow value.',
        'Growth: formal MLOps',
        'I want deeper experience with monitoring drift and automated retraining in production.',
        'I am closing that gap with coursework side projects and reading production ML ops playbooks.',
      ),
      S(
        'Strength: community leadership',
        'NSBE numbers and partnerships show execution.',
        'Growth: delegation at scale',
        'Continue building leaders under me, not just running events.',
        'Chapter initiatives now survive without me in the critical path.',
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
        'I sometimes reach for robust abstractions early—reviewers push me to prove need with data first.',
        'Balance elegance and speed.',
        'I now default to simplest change that meets SLO, then refactor when patterns repeat.',
        'PRs land faster with fewer philosophical debates.',
      ),
      S(
        'Estimation optimism',
        'Compiler and visualization projects taught me that visual polish hides integration cost.',
        'Pad estimates for unknowns.',
        'I break work into vertical slices with demos.',
        'Stakeholders get predictable milestones instead of surprise slips.',
      ),
      S(
        'Async updates',
        'Remote work means I must over-communicate status—something mentors flagged.',
        'More frequent checkpoints.',
        'I post short daily/weekly deltas in standups and docs so blockers surface earlier.',
        'Managers stopped chasing me for status—it is already there.',
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
        'A busy senior engineer delayed reviewing a protobuf change blocking my Geaux feature.',
        'Unblock without nagging.',
        'I sent a minimal diff summary, listed concrete questions, and offered two 15-minute slots; escalated with data on downstream blockers only after SLA slipped.',
        'Review landed; team respected the structure.',
      ),
      S(
        'Clinical feedback loop',
        'Neurologists were slow to answer MedDiagnose UX questions during finals week.',
        'Respect their time.',
        'I batch questions, brought screenshots, and used async Loom walkthroughs.',
        'We got answers without burning relationship capital.',
      ),
      S(
        'Sponsor contact ghosting',
        'For NSBE partnerships, a company contact went quiet while we needed budget confirmation before booking travel.',
        'Secure a yes/no without damaging the relationship.',
        'I used a polite escalation path—shorter email with two options (commit by date X or pause)—and CC’d our faculty advisor only when necessary.',
        'We got a decision in time to book at non-refundable rates or pivot to another sponsor.',
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
        'I get frustrated when postmortems skip root cause or action items—“fixed” without learning.',
        'Demand blameless depth.',
        'At Hubtel I pushed for timelines, contributing factors, and preventive tests—not just restarts.',
        'Repeat incidents dropped when we fixed upstream backpressure instead of blaming Postgres.',
      ),
      S(
        'Vanity metrics',
        'Shipping features without SLOs or user impact frustrates me.',
        'Tie work to numbers.',
        'I anchor demos to latency, error budgets, or clinical KPIs—MedDiagnose’s 35% time-to-treatment improvement, not slide filler.',
        'Teams align faster when success is measurable.',
      ),
      S(
        'Gatekeeping',
        'Communities that discourage beginners—why I invest in NSBE/ColorStack inclusion.',
        'Push back with mentorship.',
        'I run structured intro workshops (DSA basics, git hygiene) so newcomers have an on-ramp.',
        'Retention goes up when access is pedagogical, not elitist.',
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
        'Most want to ship Friday fixes; I prefer disciplined rollouts with tests even if boring.',
        'Reduce tail risk.',
        'MedDiagnose and Hubtel taught me that hotfixes without tests recreate outages; I’d rather ship a minimal, tested patch Monday.',
        'Incidents become rare; on-call stays human.',
      ),
      S(
        'Accuracy is not enough in ML',
        'Many focus on leaderboard scores; I care about calibration and workflow integration—often unpopular in hackathons.',
        'Clinical reality.',
        'I argue for decision-support UX, human-in-the-loop checkpoints, and monitoring—not leaderboard bragging.',
        'Clinicians engage when the workflow wins are honest; hackathon judges sometimes disagree until they see the pilot metrics.',
      ),
      S(
        'Community > grind culture',
        'I believe sustainable pace beats heroics; some peers glorify all-nighters.',
        'Evidence: Dean’s List + shipping.',
        'I time-box work, protect sleep during exam weeks, and still ship Geaux/VisualizeMyAlgorithm milestones.',
        'Sustainable output beats burnout theater.',
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
        'I told clinical partners the RF stroke-risk model was ~45% accurate and needed human oversight—bad news for anyone wanting a headline AI win.',
        'Transparency preserves trust.',
        'I paired the limitation with NIHSS/tPA workflow gains and concrete pilot outcomes—35% faster time-to-treatment.',
        'They accepted the system as assistive tooling; the pilot continued with clearer expectations.',
      ),
      S(
        'Sponsor shortfall',
        'NSBE officer team had to tell a partner we missed an attendance promise for an event.',
        'Own the miss; present remediation.',
        'We offered a smaller targeted workshop with guaranteed RSVPs.',
        'Sponsor stayed engaged.',
      ),
      S(
        'Demo failure prep',
        'I told hackathon teammates our live ML endpoint was too risky 6 hours before deadline.',
        'Switch to mocks.',
        'We recorded outputs, stubbed inference behind a stable API contract, and rehearsed the failure modes.',
        'We still won ColorStack Winter 2024 against ~1,000 participants—with a demo that could not flake live.',
      ),
    ],
  },
]

fs.writeFileSync(out, JSON.stringify(data, null, 4), 'utf8')
console.log('Wrote', out, 'questions:', data.length)
