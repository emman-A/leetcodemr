export const GEMS_CARDS = [
  // ── Recruiter Playbook (14 cards) ──────────────────────────────────────────
  {
    id: "g-pre-intro",
    category: "Recruiter Playbook",
    emoji: "⭐",
    front: "Pre-Cycle Intro",
    sub: "Send before June — get on their radar before the flood",
    note: null,
    attach: "résumé",
    type: "template",
    body: `Hello [First Name],

I hope you're doing well! I know recruiting for the next internship cycle is likely a little while away, but I wanted to reach out early and introduce myself.

My name is [Your Name] and I'm a [Year e.g. second-year] Computer Science student at [University]. I've been really interested in [Company] for a while — particularly the work being done on [team / product / area if you know it].

I'd love to be on your radar when the next cycle opens. I've attached my résumé in case it's helpful to have early.

Thank you so much for your time — I really appreciate it!`,
  },
  {
    id: "g-rapport-1",
    category: "Recruiter Playbook",
    emoji: "☕",
    front: "Rapport — Week 1",
    sub: "1–2 weeks after intro — genuine interest, no big ask",
    note: null,
    attach: null,
    type: "template",
    body: `Hello [First Name],

I hope you're having a great week! I just wanted to say I've really been following what [Company] has been building lately — [mention something specific e.g. the recent product launch / engineering blog post / open source work]. It gets me even more excited about potentially joining the team.

No action needed from you at all — just wanted to share that. Hope things are going well on your end!`,
  },
  {
    id: "g-rapport-2",
    category: "Recruiter Playbook",
    emoji: "☕",
    front: "Rapport — Week 2",
    sub: "Coffee chat ask — keep it low pressure",
    note: null,
    attach: null,
    type: "template",
    body: `Hello [First Name],

I hope things are going well! I've been doing a lot of research on [Company] and the more I learn, the more excited I get. I was wondering — would you ever be open to a quick 15-minute coffee chat? I'd love to hear about your experience there and what the team culture is really like.

Totally understand if you're busy — no pressure at all. Either way, I appreciate you and hope to connect soon!`,
  },
  {
    id: "g-rapport-3",
    category: "Recruiter Playbook",
    emoji: "☕",
    front: "Rapport — Week 3",
    sub: "Share something about yourself — show growth",
    note: null,
    attach: null,
    type: "template",
    body: `Hello [First Name],

Hope you're having a good week! I recently finished [a project / a course / a hackathon — be specific] and it honestly made me even more confident that [Company] is where I want to be.

I know it's a little early for the next cycle but I'm definitely going to be applying the moment it opens. Just wanted to stay in touch and keep you posted on what I've been up to!`,
  },
  {
    id: "g-rapport-4",
    category: "Recruiter Playbook",
    emoji: "☕",
    front: "Rapport — Week 4",
    sub: "Light check-in — keep it warm, no ask",
    note: null,
    attach: null,
    type: "template",
    body: `Hello [First Name],

Just checking in — hope things are great at [Company]! I've been heads-down preparing for the next recruiting season and [Company] is absolutely at the top of my list.

Looking forward to applying when the cycle opens. Thank you for always being so approachable — it really means a lot!`,
  },
  {
    id: "g-general-update",
    category: "Recruiter Playbook",
    emoji: "🔄",
    front: "General Weekly Update",
    sub: "8+ weeks before cycle opens — swap the middle line each week",
    note: "Swap ideas: finished a project · completed a course · placed in a hackathon · hit 100 LeetCode problems · read about company news · coffee chat with someone on the team · contributed to open source",
    attach: null,
    type: "template",
    body: `Hello [First Name],

Hope you're having a great week! Just wanted to keep you in the loop on what I've been up to.

Recently I [e.g. finished building X / started learning Y / placed in a hackathon / completed a course in Z / solved my 100th LeetCode problem / contributed to an open source project]. I'm really enjoying the process of getting sharper and [Company] is still very much my goal.

No action needed at all — just wanted to stay on your radar. Hope things are going well on your end!`,
  },
  {
    id: "g-cycle-open",
    category: "Recruiter Playbook",
    emoji: "🚀",
    front: "New Cycle Open",
    sub: "Send the day recruiting officially opens — reference your prior connection",
    note: null,
    attach: "résumé · cover letter · transcript",
    type: "template",
    body: `Hello [First Name],

I hope you're doing well! I just saw that [Company] has opened applications for the new internship cycle — I submitted my application for [Role] right away.

As I mentioned when we first connected, [Company] has been my top choice for a while and that hasn't changed. I've spent the past few months [working on X / improving Y / finishing a project in Z] and I feel genuinely ready.

Would you be able to take a look at my application directly? I've reattached my documents just in case. Thank you so much — I really appreciate everything!`,
  },
  {
    id: "g-applied-1",
    category: "Recruiter Playbook",
    emoji: "📋",
    front: "Applied — Ask for Interview / OA  (Sample 1)",
    sub: "Send right after submitting — bullet style, best when you have 2+ experiences",
    note: "Proven format — used by a friend to land Google. Bullets make it scannable in 10 seconds. Use the event line if you met them at Afrotech or any conference, otherwise remove it.",
    attach: "résumé",
    type: "template",
    body: `Hi [First Name],

I hope you're doing well. I recently applied for the [Role Name (Season Year)] role and wanted to briefly introduce myself:

• [Year e.g. Sophomore] in Computer Science at [Your University]
• Recently [interned / worked] at [Company], where I [built / developed / led] [what you did] using [tech stack]
• Previous experience at [Company 2], where I [what you did] that [result e.g. cut X by Y% / improved Z]

[Personal connection if any — e.g. "I enjoyed meeting the [Company] Recruiting Team at [Event e.g. Afrotech] in [Month]" OR remove this line if no event connection]

I'd love the chance to move forward with the online assessment. I've attached my résumé for reference.

Kind regards,
[Your Name]`,
  },
  {
    id: "g-applied-2",
    category: "Recruiter Playbook",
    emoji: "📋",
    front: "Applied — Ask for Interview / OA  (Sample 2)",
    sub: "Send right after submitting — paragraph style, works well with strong projects",
    note: null,
    attach: "résumé",
    type: "template",
    body: `Hi [First Name],

I recently applied for the [Role Name (Season Year)] role at [Company] and wanted to reach out directly. I'm a [Year e.g. Sophomore] in Computer Science at [Your University] with a strong passion for [relevant area e.g. backend systems / machine learning / mobile development].

Most recently I [built / designed / led] [project or experience] — [one line on what it does and the impact e.g. a real-time data pipeline that processed 1M+ events daily / a mobile app with 500+ active users]. I also [second experience or project in one line].

[Personal connection if any — e.g. "I enjoyed meeting the [Company] Recruiting Team at [Event e.g. Afrotech] in [Month]" OR remove this line if no event connection]

I'd love the opportunity to complete an online assessment or speak with the team. I've attached my résumé and would be happy to share anything else that helps. Thank you so much for your time!

Kind regards,
[Your Name]`,
  },
  {
    id: "g-followup-1",
    category: "Recruiter Playbook",
    emoji: "🔁",
    front: "Follow-Up — Week 1",
    sub: "1 week after applying with no reply",
    note: null,
    attach: null,
    type: "template",
    body: `Hello [First Name],

I hope you're doing well! I just wanted to follow up on my application for the [Role] internship — I submitted it last week and am still very excited about the opportunity.

Please let me know if there's anything else you need from my end. Thank you so much for your time!`,
  },
  {
    id: "g-followup-2",
    category: "Recruiter Playbook",
    emoji: "🔁",
    front: "Follow-Up — Week 2",
    sub: "2 weeks after applying with no reply — reattach docs",
    note: null,
    attach: "résumé · cover letter · transcript",
    type: "template",
    body: `Hello [First Name],

I hope things are going well! I'm following up once more on my [Role] internship application at [Company]. I remain genuinely excited and would love the chance to move forward in the process.

I've reattached my documents for easy reference. Thank you for your time — I really appreciate it!`,
  },
  {
    id: "g-followup-3",
    category: "Recruiter Playbook",
    emoji: "🔁",
    front: "Follow-Up — Week 3 (Final)",
    sub: "3 weeks after applying — make this the last one",
    note: null,
    attach: null,
    type: "template",
    body: `Hello [First Name],

I'll keep this as my last follow-up — I just wanted to say that [Company] remains my top choice and I'm still very hopeful about the [Role] opportunity. If the timing isn't right for this cycle I completely understand, and I'd love to stay connected for the future.

Thank you so much for your time — it genuinely means a lot!`,
  },
  {
    id: "g-thank-interview",
    category: "Recruiter Playbook",
    emoji: "🤝",
    front: "Thank You — After Interview",
    sub: "Send within 24 hours — personalise with something real from the interview",
    note: null,
    attach: null,
    type: "template",
    body: `Hello [First Name],

Thank you so much for your help in moving my application forward — I just finished my interview with the team and it was a fantastic experience.

I especially enjoyed [something specific — a question, a conversation, something they said about the team]. It honestly made me even more excited about the possibility of joining [Company].

I hope to hear good news soon, but either way I'm really grateful for the opportunity. Thank you again!`,
  },
  {
    id: "g-thank-offer",
    category: "Recruiter Playbook",
    emoji: "🎉",
    front: "Thank You — After Offer",
    sub: "Reply fast, be warm, be genuine",
    note: null,
    attach: null,
    type: "template",
    body: `Hello [First Name],

I just received the offer and I honestly couldn't be more excited — thank you so much! This means the world to me.

I really appreciate everything you did to help move my application forward. I'm going to review all the details carefully and will get back with my decision as soon as possible.

Thank you again — I feel so lucky to have had someone like you in my corner through this process!`,
  },
  {
    id: "g-thank-rejection",
    category: "Recruiter Playbook",
    emoji: "💛",
    front: "Thank You — After Rejection",
    sub: "Always send this — recruiters remember gracious candidates for next cycle",
    note: null,
    attach: null,
    type: "template",
    body: `Hello [First Name],

Thank you so much for letting me know — I genuinely appreciate the update and the transparency.

While I'm disappointed, I have a lot of respect for [Company] and everyone I've interacted with through this process. I'd love to be considered again in the next cycle if there's an opportunity.

Thank you for all your help and for keeping the door open. I hope to reconnect down the line!`,
  },

  // ── Behavioural Prep (3 cards) ─────────────────────────────────────────────
  {
    id: "g-beh-1",
    category: "Behavioural",
    emoji: "📚",
    front: "Master all behavioural patterns",
    sub: "Study every common story type — leadership, conflict, failure, teamwork",
    note: null,
    attach: null,
    type: "tip",
    body: "Study every common behavioural story type: leadership, conflict, failure, teamwork, growth, and motivation. This repo covers every pattern with sample answers.",
    url: "https://github.com/ashishps1/awesome-behavioral-interviews",
    urlLabel: "awesome-behavioral-interviews ↗",
  },
  {
    id: "g-beh-2",
    category: "Behavioural",
    emoji: "🔍",
    front: "Find company-specific questions",
    sub: "Quizlet has real question sets from past candidates",
    note: null,
    attach: null,
    type: "tip",
    body: `Search Google:\n\n"behavioural interview questions [Company Name] quizlet"\n\nQuizlet has real question sets submitted by candidates who interviewed at that exact company. It's one of the best free resources for company-specific prep.`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-beh-3",
    category: "Behavioural",
    emoji: "🎯",
    front: "Close to interview — check recent questions",
    sub: "PracHub shows real interview experiences by company",
    note: null,
    attach: null,
    type: "tip",
    body: "PracHub shows real interview experiences and recent behavioural questions reported by candidates, organised by company. Use it in the week before an interview to know what's actually being asked right now.",
    url: "https://www.prachub.com",
    urlLabel: "prachub.com ↗",
  },

  // ── Technical Prep (3 cards) ───────────────────────────────────────────────
  {
    id: "g-tech-1",
    category: "Technical",
    emoji: "💻",
    front: "Find recent coding questions by company",
    sub: "1point3acres tracks real interview problems from candidates",
    note: null,
    attach: null,
    type: "tip",
    body: "1point3acres tracks real interview problems reported by candidates. Search by company name to see what questions are actually being asked right now — filter by role (SWE intern, new grad) for the most relevant results.",
    url: "https://www.1point3acres.com/interview/problems",
    urlLabel: "1point3acres.com/interview/problems ↗",
  },
  {
    id: "g-tech-2",
    category: "Technical",
    emoji: "🔎",
    front: "How to use 1point3acres effectively",
    sub: "Filter by role to find the most relevant recent questions",
    note: null,
    attach: null,
    type: "tip",
    body: "Type the company name in the search bar — then filter by role (SWE intern, new grad) to see the most relevant recent questions. You'll often find exact problems asked in OAs and phone screens within the last few months.",
    url: null,
    urlLabel: null,
  },
  {
    id: "g-tech-3",
    category: "Technical",
    emoji: "🏢",
    front: "More company intel — process, rounds, difficulty",
    sub: "PracHub covers technical rounds too",
    note: null,
    attach: null,
    type: "tip",
    body: "PracHub also covers technical rounds — interview process, difficulty level, number of rounds, and what to expect in each stage. Great for knowing whether a company does phone screens, OAs, or straight to final round.",
    url: "https://www.prachub.com",
    urlLabel: "prachub.com ↗",
  },

  // ── Cold Emailing (3 cards) ────────────────────────────────────────────────
  {
    id: "g-cold-1",
    category: "Cold Emailing",
    emoji: "📬",
    front: "Find the right recruiter to email",
    sub: "After every application — find the recruiter on Intern Insider",
    note: null,
    attach: null,
    type: "tip",
    body: "After every job application, find the company's recruiter on Intern Insider and send a cold email directly. It genuinely moves your application up — recruiters notice candidates who go the extra mile.",
    url: "https://www.interninsider.me/",
    urlLabel: "interninsider.me ↗",
  },
  {
    id: "g-cold-2",
    category: "Cold Emailing",
    emoji: "📎",
    front: "What to attach — always three things",
    sub: "Résumé, cover letter, and transcript every time",
    note: null,
    attach: null,
    type: "tip",
    body: "Always attach three things with every cold email:\n\n• Résumé\n• Cover letter\n• Transcript\n\nKeep them as small PDFs with clear filenames like:\nEmmanuel_Oppong_Resume.pdf\nEmmanuel_Oppong_Transcript.pdf",
    url: null,
    urlLabel: null,
  },
  {
    id: "g-cold-3",
    category: "Cold Emailing",
    emoji: "✉️",
    front: "Quick cold email template",
    sub: "Short, respectful, direct — replace the brackets",
    note: null,
    attach: "résumé · cover letter · transcript",
    type: "template",
    body: `Hello [Recruiter First Name],

I understand you might be busy, so I will keep this brief. I recently applied to [Company Name] Internship, and was wondering if you could consider me directly for the role? I have attached my documents so you can learn more about me. Thank you for your time and consideration!`,
  },

  // ── Interview Rubrics (8 cards) ────────────────────────────────────────────
  {
    id: "g-rubric-1",
    category: "Interview Rubrics",
    emoji: "🔥",
    front: "Rubric: Motivation",
    sub: "What drives you — passion for impact at the right scope",
    note: null,
    attach: null,
    type: "tip",
    body: `Interviewers grade whether your motivation aligns with the role's scope of impact.

Junior: You're excited by team-level pride — shipping features, helping teammates, making your immediate team better.

Senior: You're driven by large team impact — owning systems that affect your whole org, improving how the team works, not just what it ships.

Staff: You're motivated by org-wide impact — shaping technical direction, enabling multiple teams, and solving problems that unlock the whole organisation.

Tips:
• Be specific — "I love shipping" is weak; "I get most energised when a system I own makes 30 engineers faster" is strong.
• Match your answer to the level you're interviewing for.
• Authenticity matters — interviewers can tell when motivation is performed.`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-rubric-2",
    category: "Interview Rubrics",
    emoji: "⚡",
    front: "Rubric: Ability to be Proactive",
    sub: "Taking initiative before being told — at the right scope",
    note: null,
    attach: null,
    type: "tip",
    body: `Interviewers grade whether you identify and solve problems without being asked, at a scope matching your level.

Junior: Self-driven change affecting your own focus area — you noticed a gap and fixed it without being assigned to.

Senior: Proactive change affecting 3+ people — you saw a team-wide inefficiency, proposed a solution, and drove it to completion.

Staff: Org-wide change — you identified a cross-team problem and led the initiative to resolve it, even when it wasn't your responsibility.

Tips:
• Every good "initiative" story needs to show what you noticed, why others hadn't fixed it yet, and what you did without being asked.
• Avoid stories where your proactivity was essentially just doing your job well — the bar is going beyond your assigned scope.
• Quantify the impact: how many people benefited? What changed?`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-rubric-3",
    category: "Interview Rubrics",
    emoji: "🌫️",
    front: "Rubric: Working in Unstructured Environments",
    sub: "Handling ambiguity and driving decisions forward",
    note: null,
    attach: null,
    type: "tip",
    body: `Interviewers grade your ability to operate effectively when requirements are unclear or the path forward is undefined.

Junior: You drove consensus with a small number of stakeholders — navigated ambiguity within your immediate team.

Senior: You drove consensus across your team or org — resolved conflicting requirements from multiple stakeholders and moved forward.

Staff: You drove alignment across multiple teams in a large organisation — made decisions stick when there was no single authority and the stakes were high.

Tips:
• Ambiguity stories should show that you didn't wait for perfect clarity — you gathered enough information to make a principled decision and moved.
• Show how you brought others along — alignment is as important as the decision itself.
• Acknowledge what you didn't know and how you managed that uncertainty explicitly.`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-rubric-4",
    category: "Interview Rubrics",
    emoji: "💪",
    front: "Rubric: Perseverance",
    sub: "Pushing through blockers without giving up",
    note: null,
    attach: null,
    type: "tip",
    body: `Interviewers grade whether you push through obstacles — and at what scope those obstacles were.

Junior: You overcame technical difficulties on individual tasks — a bug that resisted you, a technology you had to learn fast, a deadline you protected.

Senior: You resolved team blockers — an upstream dependency that was stalling your whole team, a cross-team coordination problem you fixed.

Staff: You removed obstacles for multiple teams — an org-wide process failure, a dependency that was blocking several teams simultaneously.

Tips:
• The best perseverance stories show what you tried first, what failed, and how you adapted — not just that you eventually succeeded.
• Show that you didn't just push harder — you got smarter about how you were approaching the problem.
• Distinguish between productive persistence and stubbornness. Good perseverance includes knowing when to change approach.`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-rubric-5",
    category: "Interview Rubrics",
    emoji: "🤝",
    front: "Rubric: Conflict Resolution & Empathy",
    sub: "Handling disagreement with clarity and care",
    note: null,
    attach: null,
    type: "tip",
    body: `Interviewers grade how you handle disagreement, tension, and difficult relationships — at escalating scope.

Junior: Implementation disagreements — you and a peer disagreed on a technical approach and resolved it constructively.

Senior: Direction disagreements with leads — you disagreed with a manager or senior engineer about the right path and navigated it professionally.

Staff: Multi-team directional alignment — you resolved a conflict between teams or functions with competing priorities, without a single decision-maker above you.

Tips:
• Show empathy explicitly — what did you understand about the other person's position before you pushed back?
• The best conflict stories end with the relationship stronger, not just the decision made.
• Avoid framing yourself as simply right and the other person as simply wrong — good conflict resolution acknowledges real validity on both sides.`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-rubric-6",
    category: "Interview Rubrics",
    emoji: "🌱",
    front: "Rubric: Growth Mindset",
    sub: "Knowing your gaps and showing measurable development",
    note: null,
    attach: null,
    type: "tip",
    body: `Interviewers grade self-awareness — do you know your strengths and weaknesses, and can you show real growth?

Junior: You learned new technologies with measurable progress — took on something unfamiliar and became genuinely competent.

Senior: You developed soft or technical skills that affected your whole team — better communication, deeper systems knowledge, improved leadership.

Staff: Your skill development had impact across multiple teams — you grew in a way that made multiple teams better, not just yourself.

Tips:
• Never say your weakness is "working too hard" or "being a perfectionist" — this reads as evasion.
• A strong growth story shows the gap honestly, then shows what you did about it specifically, then shows a measurable change.
• Growth mindset also means being able to say: "I was wrong about this, and here's what I learned."`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-rubric-7",
    category: "Interview Rubrics",
    emoji: "🗣️",
    front: "Rubric: Communication",
    sub: "Clear storytelling evaluated throughout the whole interview",
    note: null,
    attach: null,
    type: "tip",
    body: `Communication is not a single question — it's graded throughout every answer you give.

What interviewers are listening for:
• Structure: Does your answer have a beginning, middle, and end? Are you easy to follow?
• Concision: Do you get to the point, or do you ramble? Can you explain complex things simply?
• Clarity under pressure: When pushed for specifics, do you get clearer or vaguer?
• Listening: Do you actually answer the question asked, or a nearby easier one?

This dimension overlaps heavily with empathy — communication isn't just about transmitting information, it's about ensuring the other person receives it.

Tips:
• Use STAR structure (Situation, Task, Action, Result) to keep answers tight and followable.
• After answering, briefly check: "Does that answer what you were looking for?" — it shows awareness.
• Practise saying things out loud, not just thinking through them. Fluency in speaking is separate from clarity in writing.`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-rubric-8",
    category: "Interview Rubrics",
    emoji: "📊",
    front: "Rubric: Seniority Assessment",
    sub: "Your scope of impact determines your level",
    note: null,
    attach: null,
    type: "tip",
    body: `Seniority is determined by the scope of impact in your stories — not years of experience.

Individual impact → Junior
Team impact → Senior
Multiple teams / org-wide impact → Staff

How interviewers calibrate:

Junior (L3/new grad): Positive signals in nearly all 8 dimensions at the individual-to-team scope. You don't need perfect stories — you need credible ones.

Senior (L5): All 8 dimensions demonstrated at senior level. Stories should show you affecting a team, not just yourself. You're expected to drive decisions, not just execute them.

Staff (L6+): All 8 dimensions at staff level. Your stories should show impact across multiple teams. Ambiguity you navigated should have been org-wide. Conflicts you resolved should have had multi-team consequences.

The single most common mistake: telling stories that demonstrate the right behaviours at the wrong scope. Match your scope of impact to the level you're targeting.`,
    url: null,
    urlLabel: null,
  },

  // ── Interview Strategy (4 cards) ───────────────────────────────────────────
  {
    id: "g-strat-intro",
    category: "Interview Strategy",
    emoji: "🎤",
    front: "Self-Introduction Framework",
    sub: "The 4-pillar elevator pitch — memorise it, deliver it naturally",
    note: "Tailor this to EVERY company. Swap in their tech stack, their product, and why you specifically want them.",
    attach: null,
    type: "tip",
    body: `4 pillars for a strong self-intro:

1️⃣ BASIC BACKGROUND
   Name + school/major + current focus.
   For interns: school, major, focus areas, past internships, noteworthy projects.
   For full-time: past companies + consumer products you shipped.

2️⃣ KEEP IT SHARP (KISS)
   1–2 impressive projects with real metrics or challenges.
   Executive summary style: "I built X using Y which resulted in Z."
   No lengthy career timeline — show meaningful progression instead.

3️⃣ ESTABLISH RELEVANCE
   Why do THEY want YOU?
   • Is your tech stack aligned with theirs?
   • Have you built something similar to their product?
   • What unique strength do you bring to this specific role?

4️⃣ DELIVERY
   Memorise it but deliver it conversationally.
   Aim for 60–90 seconds. Engage — don't recite.

Template structure:
"Hi, I'm [Name], a [year] CS student at [University].
Most recently I [project/internship + 1 metric].
Before that I [second experience + 1 metric].
I'm drawn to [Company] because [specific reason tied to their work].
I'd love to bring [specific skill] to your [team/product]."`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-strat-questions-1",
    category: "Interview Strategy",
    emoji: "🙋",
    front: "Questions to Ask — Technical & Role",
    sub: "Ask these to signal depth and surface red flags early",
    note: "Bold questions make interviewers pause and reflect — they stand out. Always ask at least 2 questions.",
    attach: null,
    type: "tip",
    body: `TECHNICAL WORK
• What are the biggest engineering challenges the team is facing right now?
• What has been the worst technical blunder in the recent past, and what did you learn?
• How do you make technical decisions — top-down or engineer-driven?
• What does your deployment process look like?
• How much tech debt exists and how do you manage it?

ROLE-SPECIFIC
• What would be the most important problem you'd want me to solve if I joined?
• What does the ramp-up period look like for this role?
• What are the strengths and weaknesses of the current team?
• What does success look like at 30, 60, 90 days?
• How much ownership do engineers have over the features they build?`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-strat-questions-2",
    category: "Interview Strategy",
    emoji: "🏢",
    front: "Questions to Ask — Culture & Company Direction",
    sub: "Uncover team culture, management style, and company health",
    note: "These reveal whether you'll actually enjoy working there — just as important as comp.",
    attach: null,
    type: "tip",
    body: `CULTURE & WELFARE
• What is the most frustrating part about working here?
• What's unique about working here vs competitors?
• How does the company support professional development?
• What's the policy on remote work / flexible hours?
• How does the team handle disagreements or failure post-mortems?

LEADERSHIP & MANAGEMENT
• How do you train and ramp up new engineers on the team?
• How do you measure success for someone in this role?
• How do you handle underperformance on the team?
• What's your own story — how did you end up here?

COMPANY DIRECTION
• How does the company decide what to work on next?
• What's the biggest threat or challenge the company faces right now?
• Where do you see the company in 3 years?
• How does this team's work tie into the company's top priorities?`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-strat-questions-3",
    category: "Interview Strategy",
    emoji: "🚩",
    front: "Interview Red Flags to Watch For",
    sub: "What bad answers to your questions actually signal",
    note: null,
    attach: null,
    type: "tip",
    body: `Watch for these during interviews:

🚩 Vague answers about team problems
   → They're hiding culture issues or poor leadership.

🚩 "We move fast and break things" without a rollback plan
   → No engineering discipline = you'll be fighting fires constantly.

🚩 Can't name a recent technical challenge
   → The work may be maintenance-only with no growth opportunities.

🚩 High turnover on the team (ask directly)
   → "How long has the average engineer been on this team?"
   → Less than 1.5 years is a red flag.

🚩 No clear onboarding or ramp-up process
   → You'll be left to figure it out alone from day one.

🚩 Interviewer can't explain your day-to-day
   → The role is undefined — you'll be misaligned on expectations.

🚩 Pressure to decide fast with no room for questions
   → Good companies let you take time to evaluate.`,
    url: null,
    urlLabel: null,
  },

  // ── Salary & Offers (7 cards) ──────────────────────────────────────────────
  {
    id: "g-sal-comp",
    category: "Salary & Offers",
    emoji: "💰",
    front: "Understanding Your Compensation Package",
    sub: "4 components — know what each one means before you evaluate any offer",
    note: null,
    attach: null,
    type: "tip",
    body: `Every tech offer has up to 4 components:

1️⃣ BASE SALARY
   Fixed amount paid regardless of company performance.
   Bay Area new grads: $100K–$150K+ at FAANG.
   Startups offer higher base ($120K–$130K) to offset illiquid equity.
   Growth tapers at senior levels as equity dominates.

2️⃣ PERFORMANCE BONUS
   Paid semi-annually. Depends on:
   • Seniority multiplier (higher level = bigger %)
   • Individual performance multiplier (100% = met expectations, >100% = exceeded)
   • Company performance multiplier (applied to everyone equally)

3️⃣ EQUITY / STOCK
   The biggest differentiator in tech. Two types:
   • Stock Options — right to BUY shares at a fixed price. Risky if company drops.
   • RSUs (Stock Grants) — you OWN shares directly. Vest over 4 years typically.
   Vesting cliff = minimum time before any shares vest (usually 1 year).
   Publicly traded RSUs can be sold during open trading windows.

4️⃣ SIGNING BONUS
   One-time lump sum ($10K–$100K+) paid when you join.
   ⚠️ May have clawback — you repay it if you leave within 12 months.
   Great to negotiate even when base is fixed.`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-sal-equity",
    category: "Salary & Offers",
    emoji: "📈",
    front: "Equity & Vesting — What to Actually Compare",
    sub: "Not all equity is equal — vesting schedules make a huge difference",
    note: "Amazon and Snap are backloaded — you get less equity in years 1-2. Factor this into your first-year total comp comparison.",
    attach: null,
    type: "tip",
    body: `HOW VESTING WORKS
Standard 4-year vest with 1-year cliff:
• Year 1: 25% vests after the cliff
• Years 2–4: remaining 75% vests monthly or quarterly

BACKLOADED SCHEDULES (watch out)
Amazon example: 5% / 15% / 40% / 40%
→ Years 1–2 you're getting much less equity than the "annual" number implies.
→ Your real year-1 total comp is much lower than advertised.

WHAT TO CALCULATE
Always compute dollar-per-year equity, not just the total grant:
• Total grant ÷ 4 = annual equity (for linear vesting)
• For backloaded: calculate each year separately

REFRESHERS
Top companies give annual stock refreshers to retain you.
After year 2–3 your refresher grants start vesting too — effectively increasing total comp.

REAL EXAMPLES (2021, approx):
• Google L4: $158K base + $28K bonus + $81K stock = $267K total
• Meta E4: $162K base + $18K bonus + $85K stock = $267K total

Lesson: two offers with the same headline number can feel very different in year 1.`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-sal-negotiate",
    category: "Salary & Offers",
    emoji: "🤝",
    front: "Always Negotiate — Core Principle",
    sub: "The first offer is never the best offer. Recruiters expect you to push back.",
    note: null,
    attach: null,
    type: "tip",
    body: `The single most important negotiation truth:

"The initial offer is never the best package the company can offer."

Recruiters EXPECT candidates to negotiate. Not negotiating leaves real money on the table — often $10K–$30K+ for interns and new grads.

WHAT YOU CAN NEGOTIATE
• Base salary
• Signing bonus (easiest win — often flexible when base isn't)
• Equity / stock grant size
• Start date
• Project or team placement
• Remote/hybrid flexibility
• Relocation bonus

LEVERAGE TOOLS
• Competing offers → strongest negotiating tool by far
• Counter-offer scripts (see Negotiation Rules card)
• Third-party services: Rora (pay only if offer increases) or Levels.fyi

MINDSET
You're not being greedy. You're being professional.
Companies price-in negotiation. Saying yes to the first offer is leaving money they already budgeted for you.

Research market rates first:
→ levels.fyi for exact comp by company and level
→ glassdoor / blind / 1point3acres for additional data points`,
    url: "https://www.levels.fyi",
    urlLabel: "levels.fyi — comp database ↗",
  },
  {
    id: "g-sal-rules-1",
    category: "Salary & Offers",
    emoji: "📋",
    front: "Negotiation Rules 1–5",
    sub: "Information control, staying positive, and keeping leverage",
    note: null,
    attach: null,
    type: "tip",
    body: `RULE 1 — Get Everything in Writing
After every recruiter call, email a summary of what was discussed.
"Just to confirm what we discussed — base of $X, signing of $Y, start date Z."
Written records prevent scope creep and misremembering.

RULE 2 — Always Keep the Door Open
Never commit until you're 100% ready.
Never say "I accept" verbally on a call — always ask for it in writing first.
"I'm very excited, can you send the formal offer so I can review the details?"

RULE 3 — Information is Power
Don't reveal your current salary or other offer amounts unprompted.
If pressed: "I'm evaluating multiple opportunities and focusing on finding the best fit."
The less they know, the less they can anchor to a low number.

RULE 4 — Always Be Positive
Enthusiasm matters. Signal genuine interest throughout.
"I'm really excited about [Company] — you're my top choice."
Then: "I just want to make sure the comp works for both of us."
Never sound like you're threatening to leave — sound like you want to stay.

RULE 5 — Don't Be the Sole Decision Maker
"I need to discuss this with my family / partner before making a final call."
This reduces pressure and buys you time without burning the relationship.`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-sal-rules-2",
    category: "Salary & Offers",
    emoji: "⚡",
    front: "Negotiation Rules 6–10",
    sub: "Alternatives, reasons, and giving companies a path to win you",
    note: null,
    attach: null,
    type: "tip",
    body: `RULE 6 — Have Alternatives
Multiple competing offers = your strongest negotiating position.
Even interviewing elsewhere creates urgency.
When you receive offer A: immediately contact companies B, C, D to accelerate timelines.
"I have an exploding offer — is there any way to expedite?"

RULE 7 — Give Reasons for Every Ask
"I'm hoping to get closer to $X because [reason]" lands better than just asking.
Even a simple reason makes the request feel human and legitimate.
Good reasons: cost of living, student loans, competing offer, market data from levels.fyi.

RULE 8 — Negotiate Beyond Just Money
• Training budget / conference budget
• Team or project preference
• Remote days
• Extra PTO
• Earlier promotion review
Companies often prefer flexibility here over raising base salary.

RULE 9 — Understand What They Can Flex
Companies prefer signing bonuses and equity over raising base salary.
(Base raises affect every subsequent year's bonus calculations — it compounds.)
Ask for signing bonus first if base is stuck: "If base can't move, could we increase the signing?"

RULE 10 — Be Winnable
Give them a clear path to get you.
"If you can get to $X, I'm ready to sign immediately."
Recruiters are on your side — they want to close. Make it easy for them to go to bat for you internally.`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-sal-choose-1",
    category: "Salary & Offers",
    emoji: "⚖️",
    front: "Choosing Between Offers — Comp & Growth",
    sub: "How to compare two offers beyond the headline number",
    note: "Always calculate year-1 real take-home — headline total comp includes equity that may not vest for years.",
    attach: null,
    type: "tip",
    body: `COMPENSATION — look deeper than the total
• Calculate EACH year separately (esp. backloaded vesting at Amazon/Snap)
• Consider "dollars per hour" — some companies expect 50–60hr weeks
• Factor in signing bonus clawback risk if you leave early
• Will stock refreshers kick in by year 2–3?

CAREER GROWTH — ask directly
• Startup: wear many hats, ship fast, but shallower technical depth
• Meta: fast promotion cycles (E3→E4 in ~2 years)
• Google: slower ladder but emphasis on engineering excellence
• Ask: "What does the path from [my level] to the next level look like here?"
• Ask: "How long does the average engineer take to get promoted?"

PRODUCTS & TEAMS — does the work excite you?
• Will you use what you build? Motivation compounds over years.
• What does your specific office/team actually work on (not just company-wide)?
• Is this team central to the company's mission or a peripheral product?

THE PRAGMATIC ENGINEER TEST — rate each company on:
• Equity, roadmaps, code reviews, CI/CD pipeline
• Career ladders, feedback systems, professional development
• Eng blog quality (signal of engineering culture)`,
    url: null,
    urlLabel: null,
  },
  {
    id: "g-sal-choose-2",
    category: "Salary & Offers",
    emoji: "🌍",
    front: "Choosing Between Offers — Culture & Life",
    sub: "The factors that determine if you'll still be happy in year 2",
    note: null,
    attach: null,
    type: "tip",
    body: `WORK-LIFE BALANCE
• Google: known for strong balance
• Amazon: lower rated for WLB historically
• Avoid: companies that expect 6-day work weeks as a norm
• Ask directly: "What does a typical week look like for engineers on this team?"

COMPANY CULTURE — key questions to ask
• "What's the most frustrating part about working here?"
• "What do you wish was different?"
• Honest answers to these reveal more than any glassdoor review

COMPANY PROSPECTS
• For startups: how long is their runway? What's their last valuation?
• Equity in a failed startup = $0. Weight it accordingly.
• For public companies: stock is liquid but tied to market performance.

MOBILITY & TRANSFERS
• Meta, Google, Apple, Stripe all offer internal mobility and global offices
• Great if you want to move cities or try different product areas without job-hopping

FINAL FRAMEWORK — score each company on:
1. Compensation (year-1 real number)
2. Career growth speed
3. Work-life balance
4. Product excitement
5. Team quality
6. Company trajectory
7. Location / remote flexibility

Weight each by what matters most to YOU right now — different at 22 vs 30.`,
    url: null,
    urlLabel: null,
  },

  // ── Big-O Reference ────────────────────────────────────────────────────────
  {
    id: "bigo-arrays",
    category: "Big-O Reference",
    emoji: "📊",
    front: "Arrays & Dynamic Arrays",
    sub: "Access O(1) · Search O(n) · Append O(1)* · Insert/Delete O(n)",
    type: "tip",
    body: "Access by index: O(1)\nSearch (unsorted): O(n)\nAppend (amortized): O(1)\nInsert at position: O(n)\nDelete at position: O(n)\nSpace: O(n)",
    note: "*amortized — occasional O(n) resize",
  },
  {
    id: "bigo-hashmap",
    category: "Big-O Reference",
    emoji: "🗂",
    front: "Hash Map / Hash Set",
    sub: "Insert O(1) · Delete O(1) · Search O(1) — all average case",
    type: "tip",
    body: "Insert: O(1) avg · O(n) worst\nDelete: O(1) avg · O(n) worst\nSearch: O(1) avg · O(n) worst\nSpace: O(n)\n\nWorst case with hash collisions — use good hash function.",
    note: null,
  },
  {
    id: "bigo-sorting",
    category: "Big-O Reference",
    emoji: "📶",
    front: "Sorting Algorithms",
    sub: "Quicksort O(n log n) avg · Mergesort O(n log n) stable · TimSort default",
    type: "tip",
    body: "Quicksort: O(n log n) avg · O(n²) worst · O(log n) space\nMergesort: O(n log n) always · O(n) space · stable\nHeapsort: O(n log n) always · O(1) space · not stable\nBubble/Insert/Select: O(n²) — only for tiny n\n\nPython/Java use TimSort (Merge+Insert) — O(n log n) stable.",
    note: null,
  },
  {
    id: "bigo-binarysearch",
    category: "Big-O Reference",
    emoji: "🔍",
    front: "Binary Search",
    sub: "O(log n) — requires sorted array",
    type: "tip",
    body: "Search: O(log n)\nSpace: O(1) iterative · O(log n) recursive\n\nRequires sorted input. Each step halves the search space.\nUse bisect_left/bisect_right in Python.",
    note: null,
  },
  {
    id: "bigo-trees",
    category: "Big-O Reference",
    emoji: "🌳",
    front: "Binary Search Tree (BST)",
    sub: "O(log n) avg · O(n) worst (unbalanced)",
    type: "tip",
    body: "Search/Insert/Delete: O(log n) avg · O(n) worst\nAVL/Red-Black Tree: O(log n) guaranteed\nSpace: O(n)\n\nHeight balanced trees (AVL, RB): always O(log n).\nPython: use sortedcontainers.SortedList.",
    note: null,
  },
  {
    id: "bigo-heap",
    category: "Big-O Reference",
    emoji: "⛰️",
    front: "Heap / Priority Queue",
    sub: "Insert O(log n) · Peek O(1) · Pop O(log n) · Build O(n)",
    type: "tip",
    body: "Insert (push): O(log n)\nPeek min/max: O(1)\nPop min/max: O(log n)\nBuild heap from list: O(n) — use heapq.heapify()\nSearch: O(n)\nSpace: O(n)\n\nPython: heapq is min-heap. Negate values for max-heap.",
    note: null,
  },
  {
    id: "bigo-graphs",
    category: "Big-O Reference",
    emoji: "🕸️",
    front: "Graph BFS & DFS",
    sub: "Time O(V+E) · Space O(V) — V = vertices, E = edges",
    type: "tip",
    body: "BFS: O(V+E) time · O(V) space (queue)\nDFS: O(V+E) time · O(V) space (stack/recursion)\nDijkstra: O((V+E) log V) with min-heap\nBellman-Ford: O(VE)\nFloyd-Warshall: O(V³)\nTopological sort: O(V+E)",
    note: null,
  },
  {
    id: "bigo-trie",
    category: "Big-O Reference",
    emoji: "🌐",
    front: "Trie (Prefix Tree)",
    sub: "Insert/Search O(m) — m = word length",
    type: "tip",
    body: "Insert: O(m)\nSearch: O(m)\nPrefix search: O(m)\nSpace: O(n × m) — n words, m avg length\n\nBest for autocomplete, prefix matching, word dictionaries.",
    note: null,
  },
  {
    id: "bigo-unionfind",
    category: "Big-O Reference",
    emoji: "🔗",
    front: "Union-Find (Disjoint Set)",
    sub: "O(α(n)) ≈ O(1) amortized with path compression + rank",
    type: "tip",
    body: "Find: O(α(n)) ≈ O(1) amortized\nUnion: O(α(n)) ≈ O(1) amortized\nSpace: O(n)\n\nα(n) is inverse Ackermann — grows incredibly slowly, practically constant.\nUse for cycle detection in graphs and Kruskal's MST.",
    note: null,
  },
  {
    id: "bigo-stack-queue",
    category: "Big-O Reference",
    emoji: "📚",
    front: "Stack & Queue / Deque",
    sub: "Push/Pop/Enqueue/Dequeue all O(1)",
    type: "tip",
    body: "Stack (list/deque): push O(1) · pop O(1) · peek O(1)\nQueue (deque): enqueue O(1) · dequeue O(1)\nMonotonic Stack: amortized O(n) for n operations\nDeque: O(1) both ends · Python: collections.deque\n\nUse deque for BFS queue — list.pop(0) is O(n).",
    note: null,
  },
];

export const GEMS_CATEGORIES = ["All", "Recruiter Playbook", "Behavioural", "Technical", "Cold Emailing", "Interview Strategy", "Salary & Offers", "Interview Rubrics", "Big-O Reference"];

export const GEMS_CAT_COLOR: Record<string, string> = {
  "Recruiter Playbook":  "bg-rose-50 text-rose-700 border-rose-200",
  "Behavioural":         "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Technical":           "bg-violet-50 text-violet-700 border-violet-200",
  "Cold Emailing":       "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Interview Strategy":  "bg-orange-50 text-orange-700 border-orange-200",
  "Salary & Offers":     "bg-lime-50 text-lime-700 border-lime-200",
  "Interview Rubrics":   "bg-sky-50 text-sky-700 border-sky-200",
  "Big-O Reference":     "bg-cyan-100 text-cyan-700 border-cyan-200",
};
