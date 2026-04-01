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

// —— Resume-aligned story blocks — conversational interview tone ——
const GEAUX_CH = [
  S(
    'Change History: event consolidation',
    'So at Geaux I was an Associate SWE Intern, remote, summer 2025. Engineering and content both cared about “who changed what” for podcasts and media, but the truth was spread across a bunch of backend event sources that didn’t always line up.',
    'I needed to ship a Change History view in TypeScript and SCSS that actually helped people trace edits—without trying to boil the ocean on v1.',
    'What I did was get both sides in one room, stack-rank the event sources by how much traceability we’d get per unit of work, then ship in phases. I surfaced the highest-value protobuf-backed events first and tightened integration tests on the read path so we weren’t guessing in prod.',
    'We ended up with much clearer traceability end to end, and because we phased it, releases stayed predictable instead of turning into a never-ending scope creep thing.',
  ),
  S(
    'gRPC service layer + tests',
    'The podcast side was moving toward Java services talking gRPC with Protocol Buffers, and honestly if ingestion data was wrong, it wasn’t just a UI bug—it hit creators and listeners downstream.',
    'My job was to help make that pipeline accurate for internal services feeding ingestion and distribution—think tens of thousands of monthly listeners—while keeping the contracts something we could actually test.',
    'I worked in Java and gRPC, tightened protobuf definitions, and added real end-to-end coverage across the RPC boundary—not only happy-path unit tests. I also validated against real ingestion flows so we weren’t fooling ourselves.',
    'We roughly doubled measured accuracy on the ingestion path, which made it safer for other teams to build on top of those services.',
  ),
  S(
    'RBAC, logging, and a11y on RPC',
    'Creators and admins were touching sensitive flows, and some RPC endpoints really couldn’t behave the same for both. We also needed enough logging and accessibility coverage that we weren’t flying blind—or shipping something only usable for one narrow path.',
    'I needed to harden the product without blocking the main feature work.',
    'So I added interaction logging on the critical flows, ran accessibility testing on the key UI paths, and put role-based access control on the sensitive gRPC endpoints so “creator vs admin” wasn’t ambiguous.',
    'It cut down on privilege mix-ups, made audits easier, and honestly made cross-team collaboration less scary because expectations were explicit.',
  ),
]

const HUBTEL = [
  S(
    'Kafka/MQTT/Postgres pipeline',
    'I interned at Hubtel in Ghana in 2023. The business was super transaction-heavy, so system events were noisy and downtime was real money—and real trust.',
    'I needed to help the team catch problems faster without destabilizing the payment workflows everyone depended on.',
    'I worked on a real-time pipeline with Kafka Connect, MQTT, and Postgres—basically following events from broker to sink, using integration tests and metrics when something looked off instead of guessing.',
    'We got downtime detection time down by something like 40%, and payments felt more available because we weren’t always firefighting blind.',
  ),
  S(
    'Spring Boot test expansion',
    'A lot of the scary failures weren’t “unit test red”—they were integration-shaped: database, messaging, HTTP handoffs. That’s normal for payment-adjacent services.',
    'I needed to raise confidence in the backend paths that touched money.',
    'I wrote more than twenty Spring Boot tests—JUnit plus Postman collections—and I focused on transaction boundaries and the ways things actually break, not just bumping coverage for the number.',
    'In the areas we targeted, reliability improved a ton—on the order of 80%—and we caught regressions before they hit prod way more often.',
  ),
  S(
    'Firebase push latency',
    'People needed status and transaction updates fast. If notifications lagged or flaked, it looked like “the app is broken” even when the backend was fine.',
    'I needed pushes to land fast enough to be useful when something important changed.',
    'I wired up Firebase push, then measured end-to-end latency and tuned batching and delivery. Where the stack could do it, we kept critical signals in that sub-10ms kind of range.',
    'Users felt the system respond faster, and it paired well with the pipeline work—we weren’t debugging in the dark.',
  ),
]

const MED = [
  S(
    'MedDiagnose stack + pilot',
    'MedDiagnose was a full-stack stroke project—Python and TypeScript, FastAPI, TensorFlow, React—with real-time monitoring, NIHSS scoring, RBAC, and tPA eligibility checks. The goal was to cut delays, not to win a Kaggle trophy.',
    'I needed something we could honestly take into a Louisiana hospital pilot—not a demo that oversold the ML.',
    'I worked across FastAPI, the React clinical UI, and the model side. The Random Forest stroke-risk score landed around 45% accuracy, so I was upfront about that and focused the story on workflow wins for neurologists.',
    'We ran a hospital pilot that helped with early detection and cut time-to-treatment by about 35%, which was the outcome clinicians actually cared about.',
  ),
  S(
    'ML + clinical translation',
    'Clinicians don’t think in “model accuracy” the way engineers do—they care about when the score is misleading, when to ignore it, and how it fits into a busy shift.',
    'I needed the ML to be helpful without pretending it replaces judgment.',
    'I translated what the model was doing into plain language in the UI, documented uncertainty, and made the human decision points obvious instead of hidden.',
    'That kept trust. Automation still helped with routing, alerts, and eligibility prep—just in a way people could defend in a real hospital.',
  ),
  S(
    'Full-stack reliability',
    'When you’re monitoring patients in real time, a React state bug can look like a clinical emergency. And if RBAC is wrong, you’re not just shipping a bug—you’re risking data.',
    'I needed the system to stay stable under load and stay compliant by design.',
    'So I focused on RBAC end to end, clearer API errors, and making the monitoring views render fast enough that people would actually use them.',
    'The pilot held up, and the hospital team felt like access control matched how they work.',
  ),
]

const VIZ = [
  S(
    'VisualizeMyAlgorithm scale',
    'I built VisualizeMyAlgorithm in React—think pathfinding, sorting, even neural-net style demos—and over a thousand learners have used it.',
    'I wanted it to feel fast and actually teach, not just look cool.',
    'I built modular visualization components—Dijkstra, A*, Minimax, that kind of thing—plus the state management and rendering pipeline so you could step through execution instead of watching a GIF.',
    'People said they understood concepts faster—roughly 40% faster in the informal timing we did—and the thing could handle a real classroom without the UI freezing.',
  ),
  S(
    'State + performance',
    'Algorithm viz is state-heavy. If you’re not careful in React, you rerender yourself into the ground.',
    'I needed smooth interactions even on bigger graphs and mid-tier laptops.',
    'So I batched updates per tick, memoized the expensive stuff, and capped work per frame so we weren’t dropping frames during a lecture.',
    'That’s why professors could actually adopt it without handing students a gaming laptop.',
  ),
  S(
    'Pedagogy + engineering',
    'The whole point was learning, not flashy graphics for their own sake.',
    'I wanted every animation tied to something a student could verify—like “this is the frontier” or “this edge just relaxed.”',
    'I synced what you saw on screen with the algorithm’s real invariants so people could connect the code to the motion.',
    'It felt less like magic, and students actually retained the fundamentals.',
  ),
]

const COMPILER = [
  S(
    'Mini-compiler engineering',
    'I built a mini compiler in C, C++, Python, and Yacc—lexing, parsing, IR, optimizations—basically a teaching tool for people learning how compilers work.',
    'I needed it to be correct enough that people trusted it, but still easy to extend.',
    'I implemented the lexer and parser, IR generation, constant folding, dead-code elimination, and decent error messages when things broke.',
    'Fifty-plus developers ended up using it, and folks said debugging time dropped by around 35% compared to the usual “edit and pray” homework loop.',
  ),
  S(
    'Correctness first',
    'Early on I moved fast and added features, and little parser bugs turned into weird IR bugs downstream.',
    'I had to stabilize the foundation before chasing optimizations.',
    'I tightened the grammar, added regression tests for the nasty edge cases, and only then layered optimizations once the baseline was green.',
    'After that, other people could actually build on it without fighting ghosts.',
  ),
  S(
    'Performance story',
    'For compiler projects, “faster” has to mean something measurable on real programs students write—not a slide deck claim.',
    'I needed to prove the optimizations mattered.',
    'I benchmarked before and after on representative snippets and tried to keep passes predictable so debugging stayed sane.',
    'Runtime improved where it counted, and the codebase stayed maintainable enough to teach from.',
  ),
]

const NSBE = [
  S(
    'NSBE Gen-Sec + partnerships',
    'I’m Gen-Sec for NSBE at Grambling starting January 2025. After the pandemic dip, people wanted the chapter to feel technically serious—not just another social club.',
    'I needed to rebuild energy and land sponsors in a way that actually helped CS students.',
    'So I got practical about outreach, aligned officers around what members were asking for, and when we talked to companies I made sure we could point to real impact—not vibes.',
    'We grew past 300 members and brought in about three thousand dollars in technical partnerships.',
  ),
  S(
    'Cross-officer conflict',
    'Officers argued about hackathons vs corporate events vs K-12 outreach. Everyone had a pet priority.',
    'I needed to turn that into a plan we could execute instead of debating forever.',
    'I ran quick surveys, looked at what people actually showed up for, and mapped sponsor commitments to specific events so we weren’t overpromising.',
    'Once priorities were evidence-based, execution got easier and the drama cooled down.',
  ),
  S(
    'Engineering identity',
    'A lot of members didn’t need another “professional development” flyer—they needed interview prep, projects, and real technical reps.',
    'I wanted NSBE to be the place on campus for that.',
    'I pushed workshops toward DSA, light system design, and internship pipelines—stuff that lines up with what recruiters actually test.',
    'CS majors started showing up more and sticking around because it felt relevant.',
  ),
]

const COLORSTACK = [
  S(
    'ColorStack hackathon win',
    'I’m in ColorStack, and their hackathons pull serious competition—Winter 2024 had on the order of a thousand people worldwide.',
    'We had to ship something demoable on a tight clock.',
    'Our team cut scope to an MVP early, split frontend and backend ownership clearly, and rehearsed the demo so we weren’t doing live surgery on stage.',
    'We won Winter 2024, which was a good proof that I can execute when time is not on your side.',
  ),
  S(
    'Community leverage',
    'ColorStack is how I pressure-test my portfolio against peers who are also trying to land strong internships.',
    'I wanted the membership to turn into real skill growth, not just another line on a resume.',
    'I leaned on mentor feedback and peer review to tighten my project stories and clean up code before interviews.',
    'It shortened the gap between “I’m applying” and “I’m getting callbacks.”',
  ),
  S(
    'Balance with coursework',
    'Hackathons and classes don’t negotiate with each other—they both want your nights.',
    'I still wanted to keep Dean’s List, my Presidential Scholarship, and not ship garbage demos.',
    'I time-boxed scope, reused UI pieces I’d already built, and in the last twelve hours I refused random feature creep.',
    'I shipped demos I could defend, and my grades didn’t fall off a cliff.',
  ),
]

const EDU = S(
  'Grambling CS foundation',
  'I’m Emmanuel Acheampong. I’m a Computer Science major at Grambling State University, graduating May 2027. I’ve been on Dean’s List in ’24 and ’25, I’m on a Presidential Scholarship, and I won gold in the Vanda African Math Olympiad back in 2018. Coursework-wise I’ve done OOP, software engineering, data structures and algorithms, and operating systems.',
  'What I’m trying to show in interviews is that I don’t just do homework—I ship.',
  'That’s why I paired school with internships at Geaux and Hubtel and bigger projects like MedDiagnose, VisualizeMyAlgorithm, and a mini compiler. I like when the same DSA and systems ideas show up in something users actually touch.',
  'So when I build something, I’m usually thinking about tests, traceability, and whether we can measure the impact—not just “does it compile.”',
)

const MOTIVE = [
  S(
    'Impact + systems',
    'I get excited when I can point to the impact—latency, availability, accuracy, whatever the real KPI is. If it’s just shipping widgets with no measurement, I lose steam.',
    'I’m looking for a place where the work lines up with the kind of backend, data, and full-stack problems I’ve already wrestled with.',
    'Geaux gave me gRPC and protobuf and RBAC. Hubtel gave me Kafka, MQTT, Postgres, Firebase. MedDiagnose gave me clinical ML with React on top. That’s the flavor of depth I want more of.',
    'I’m basically trying to find the next team where the bar is high and the problems are real.',
  ),
  S(
    'Growth vector',
    'I learn fastest when the system fights back—schema changes, idempotency, weird failure modes—not toy CRUD tutorials.',
    'I want a team with real code review and real expectations, not theater.',
    'I’ve chased internships and projects that pushed me into distributed systems, messy ML in the real world, and low-level compiler-style thinking on purpose.',
    'Long term I want deeper ownership on services and cleaner collaboration across teams—not just closing tickets in a silo.',
  ),
  S(
    'Mission + craft',
    'Healthcare and fintech both taught me that “works on my laptop” is not the flex people think it is. Auditability and correctness actually matter.',
    'I’m drawn to places that invest in testing and observability, and that care about inclusive product design—not as a buzzword, but as behavior.',
    'That lines up with how I approached RBAC, logging, accessibility checks, and honest ML framing on MedDiagnose.',
    'That’s the kind of environment where I do my best work.',
  ),
]

const JUDGE = [
  S(
    'Production change discipline',
    'Friday afternoon “we need this in prod now” energy is real, but a lot of the time it’s urgency without severity.',
    'My instinct is to protect users and the team from a sloppy deploy.',
    'I’d ask what’s actually broken, who’s affected, whether we can roll back, and whether on-call is around. If it’s fuzzy, I’d rather ship a tiny reversible change behind a flag—or wait until Monday with a clear incident write-up—than gamble.',
    'That “slow down and get the facts first” approach is what kept releases sane for me at Hubtel and Geaux.',
  ),
  S(
    'MedDiagnose lesson: trust',
    'With MedDiagnose, not everyone loved the ML numbers at first—and that’s fair. Clinical folks deserve honesty.',
    'I needed to be straight about risk instead of selling a fairy tale.',
    'I was upfront that the RF model was around 45% accurate on that risk signal, and I paired that with the workflow outcome we could prove—like faster time-to-treatment, roughly 35% improvement in the pilot.',
    'People respected that more than hype. Trust went up, and we didn’t pretend the model was magic.',
  ),
  S(
    'Evidence over noise',
    'In event systems, the symptom often shows up downstream when the real issue is upstream—serialization, backpressure, something like that.',
    'I try not to patch the first thing that looks red.',
    'At Hubtel I walked Kafka to MQTT to Postgres with logs and tests before touching the “obvious” hot path. That stopped repeat incidents where we kept treating the wrong layer.',
    'That’s the same discipline I’d bring to a Friday prod question—I’m going to trace it, not guess.',
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
        'At Geaux, my first gRPC/protobuf slice passed tests, but teammates told me it was hard to extend—names and module boundaries didn’t make ownership obvious.',
        'I needed to take the feedback seriously and make the next changes easier for everyone, not just me.',
        'I cleaned up how we packaged protobufs, added contract tests right at the RPC edge, and wrote down what errors actually mean for callers.',
        'Reviews got less painful, and the next features landed without those messy integration surprises.',
      ),
      S(
        'ML calibration reality check',
        'Mentors basically said, “You can’t headline 45% accuracy like it’s a flex—people will misunderstand what the model can do.”',
        'I needed to tell the story in a way clinicians and leadership could use, not misread.',
        'I moved the narrative toward calibration, clearer language about failure modes, and workflow numbers like time-to-treatment instead of a big accuracy banner.',
        'People actually used the dashboard. Clinicians leaned in more because it felt honest.',
      ),
      S(
        'Compiler scope creep',
        'On my mini compiler someone called me out for optimizing before the parser was solid—classic premature optimization, and they were right.',
        'I had to reorder the work: correctness first, speed second.',
        'I paused the fancy IR passes until lexer and parser tests covered the weird tokens, then brought optimizations back with real benchmarks.',
        'The compiler got stable, and the feedback stopped being an issue because the foundation was there.',
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
        'A teammate wanted to merge a Spring change, but integration coverage around a payment edge case was thin—and I’d already seen that path fail in staging.',
        'I needed to flag it without making it personal.',
        'I reproduced it with a small Postman sequence, dropped the logs in chat, and suggested a focused JUnit setup—maybe Testcontainers—so we weren’t debating vibes. I framed it as “we both own quality,” not “you messed up.”',
        'They added tests, we merged, and I slept better.',
      ),
      S(
        'NSBE officer workload',
        'One officer kept promising huge turnout numbers, and sponsors and volunteers were getting burned when reality didn’t match.',
        'I needed to give direct feedback, but do it privately and with respect.',
        'I pulled real attendance trends, compared them to what we’d promised, and suggested smaller events we could actually fill. I also pointed out what they were great at—marketing—so it wasn’t “you’re bad,” it was “let’s align promises.”',
        'Next quarter we hit our targets without exhausting people.',
      ),
      S(
        'Hackathon scope',
        'During ColorStack Winter someone wanted a live ML API wired up, and with twelve hours left that was not going to be stable.',
        'I needed a Plan B fast.',
        'I suggested we mock the boundary, record outputs, and demo against that so judges saw real behavior without a live wire that could 500 mid-pitch.',
        'We shipped on time and the story was still technically honest.',
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
        'I told people we’d ship a Mini-Compiler drop with optimizations, but lexer coverage wasn’t there yet. Demo night hit, and a weird tokenization edge case blew up.',
        'I needed to own it and fix trust, not pretend it was fine.',
        'I told folks right away, cut the extra features I’d promised for that release, and shipped a hotfix branch once tests actually passed.',
        'People got a stable build within a few days, and I got better at saying “not yet” on dates.',
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
        'For me, inclusion isn’t a sticker you slap on at the end. If creators and admins see different things, permissions and keyboard paths have to work for both—or you’ve built a product that only works for one persona.',
        'I try to bake that into acceptance criteria up front.',
        'At Geaux I paired accessibility checks with RBAC on the RPC-backed UI so we didn’t ship a flow that “worked for me” but broke for a restricted role.',
        'We caught a few ugly gaps before real users did.',
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
        'I don’t learn much from reading random blogs if I’m not shipping with the tool. I’ll follow release notes for stuff I actually touch—gRPC and protobuf, Kafka, React, TensorFlow when I’m in that world.',
        'If something sounds interesting, I want to try it in a branch, not just bookmark it.',
        'I’ll spike a change in VisualizeMyAlgorithm or my compiler project, benchmark it, and only then adopt it.',
        'That’s how I avoid chasing hype that doesn’t survive real code.',
      ),
      S(
        'Papers + practice',
        'With ML, a Kaggle score doesn’t mean it’ll survive a hospital pilot. Data shifts, labels are messy, and “accuracy” can lie.',
        'I try to stay grounded in how models fail, not just how they win.',
        'MedDiagnose forced me to care about drift and evaluation beyond one headline number.',
        'So when I read new architectures, I’m asking “where does this break in production?” not “is it trendy?”',
      ),
      S(
        'Community signal',
        'NSBE and ColorStack put me around people who are grinding the same interviews and stacks I am.',
        'It’s a fast feedback loop on what’s actually being asked.',
        'I swap system-design notes and “what just showed up in interviews” stories with peers who’ve been through tough loops.',
        'It keeps my study list aligned with what employers really test.',
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
        'We renamed a protobuf field and suddenly the service started 500ing—classic client and server on different generated stubs.',
        'I needed to find the mismatch without thrashing production.',
        'I walked the `.proto` history, pinned versions in CI so codegen couldn’t drift silently, and added a contract test that fails if someone ships stale stubs.',
        'After that, deploys got boring in the best way—fewer surprise outages.',
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
        'When a design task feels fuzzy, it’s usually because nobody said what “good” means—latency, durability, compliance, that kind of thing.',
        'I start from the user journey and what breaks if we’re wrong.',
        'I sketch data flows, call out trust boundaries like RBAC and PII, and only then pick patterns—REST, gRPC, events—based on coupling and scale. It’s similar to how Geaux and Hubtel split responsibilities.',
        'You end up with a short doc people can actually argue with on day one instead of coding blind.',
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
        'Engineering and content had both started “audit” style views. Shipping two would’ve confused users and wasted effort.',
        'We needed one story and one roadmap.',
        'We picked a single Change History direction, aligned on shared event contracts, and dropped the duplicate prototypes.',
        'Users saw one coherent experience, and neither team had to redo the same work.',
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
        'School gives me the vocabulary—OS, DSA—and internships give me the bruises. When I see backpressure in Kafka or weird blocking in gRPC, I can map it to something I read in class.',
        'I don’t want theory and practice to live in separate worlds.',
        'When I hit a failure mode I don’t understand, I’ll go back to the core material instead of only Stack Overflowing.',
        'It makes new stacks feel less like magic and more like patterns.',
      ),
      S(
        'Open source reading',
        'I read real server code and gRPC examples from actual repos—not just hello-world tutorials.',
        'I’m trying to pick up idioms, not copy-paste.',
        'I’ll diff how upstream handles errors and versioning, then try a tiny repro in a branch before I touch prod services.',
        'My Geaux reviews got easier because I could say “this is how mature codebases do it” instead of inventing something one-off.',
      ),
      S(
        'Mentor feedback',
        'Mentors in ColorStack and NSBE are blunt in a good way—resume depth, tests, how I talk in interviews.',
        'When they flag something, I treat it like a bug ticket.',
        'I turn it into drills: extra Spring/JUnit cases, tighter demo scripts, resume bullets that actually tie to metrics.',
        'Once I did that consistently, interviews felt less random.',
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
        'At Geaux I had a release window stacked on top of finals. I couldn’t ship every RBAC edge case and still sleep.',
        'I needed to cut scope without sneaking it in.',
        'I wrote down must-have versus nice-to-have protections for the RPCs, shipped what actually blocked bad access, and moved the rest with my manager’s OK.',
        'We skipped a risky Friday deploy, and my manager still trusted me because I was upfront.',
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
        'My remote teammate and I read the same protobuf fields differently, so we both built pieces of the Change History API—wasted effort.',
        'We needed one shared picture of the contract.',
        'I booked a short pairing slot, screenshared the proto, and we added comments plus a test that locked the meaning.',
        'After that we stopped stepping on each other.',
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
        'At Hubtel, push notifications weren’t just “call Firebase.” I had to learn batching quirks and what happens when device tokens go stale.',
        'I wanted to understand the real behavior, not just ship and hope.',
        'I read the Firebase docs on priorities and actually traced device-level behavior with logs.',
        'I learned sub-10ms only happens where the stack allows—and I got better at saying that out loud to the team.',
      ),
      S(
        'TensorFlow serving constraints',
        'MedDiagnose taught me the boring lesson that train and serve can differ—input shapes drift, and the model won’t always scream.',
        'I needed to catch that before silent bad scores.',
        'I added schema validation on the FastAPI side for feature vectors coming in.',
        'We saw fewer “why is this score weird?” moments in the pilot.',
      ),
      S(
        'gRPC interceptors',
        'For RBAC at Geaux I didn’t want auth checks copy-pasted everywhere—too easy to miss one handler.',
        'I wanted one place that enforced the rules.',
        'I prototyped gRPC interceptors on a branch, rolled them to the riskiest RPCs first, and regression-tested creator vs admin.',
        'Auth lived in one spot, and reviews got easier because we weren’t hunting scattered guards.',
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
        'Alerts made it look like Postgres was the villain, but when I looked closer, MQTT was backing off under bursts and everything downstream screamed.',
        'I needed to find the real choke point instead of restarting the database.',
        'I lined up Kafka lag, MQTT publish rates, and Postgres stalls, then tuned batching and consumer parallelism where it actually mattered.',
        'Mean time to detect got way better—about 40%—because we fixed upstream, not just the symptom.',
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
        'I could’ve shipped a flashy VisualizeMyAlgorithm update for quick attention, but the state management was messy and the UI stuttered on big graphs.',
        'I chose boring refactors over short-term hype.',
        'I batched updates per tick, memoized the expensive bits, and added simple perf checks in CI before new viz work.',
        'Demos for Dijkstra, A*, Minimax got smoother, and I wasn’t debugging “why did the page freeze?” at midnight.',
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
        'In five years I want to be the engineer who owns real services end to end—API design, reliability, working with product—and can point to metrics that prove it.',
        'I don’t want depth only in a corner nobody sees.',
        'Geaux, Hubtel, and MedDiagnose already mix backend, data, and user-facing surfaces; I want that at larger scale.',
        'That means mentoring people, sharper architecture, and fewer 3 a.m. fires.',
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
        'A great day for me is pretty simple: CI is green on something I care about, I get a focused block to profile or trace a real issue, and I still have time to help someone with tests or design.',
        'I like building alone and winning with the team—not one or the other.',
        'That’s what my best days at Geaux and Hubtel felt like.',
        'I go to bed tired but knowing something moved—latency, coverage, or a user unblocked.',
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
        'In the first month I want to ship small, real fixes so I learn your build, deploy, and on-call reality. By two or three months I want to own a slice with clear SLOs. By six months I’d love to lead something cross-team—maybe observability or tightening tests around a pipeline.',
        'I’m not trying to just close tickets; I want impact I can measure.',
        'That’s similar to how I ramped at Geaux on gRPC and protobuf—I started narrow and earned scope.',
        'If I can point to reliability or latency wins, that’s a good six months.',
      ),
      S(
        'Relationships',
        'Early on I’d map who matters—security, product, support—and agree how we communicate when things go wrong.',
        'It saves drama later.',
        'On MedDiagnose I did a lighter version of that with clinical staff: short updates, honest timelines.',
        'When something breaks, people already trust you because you didn’t ghost them in the calm times.',
      ),
      S(
        'Testing culture',
        'I want to leave RPC and pipeline tests stronger than I found them—especially where bugs are expensive.',
        'That’s how you pay the next engineer forward.',
        'I’d spend real time on flaky tests and contract tests in the first quarter so velocity compounds instead of decaying.',
        'The next hire shouldn’t inherit mystery failures.',
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
