/**
 * Context sent to Gemini when generating behavioral STAR answers (server-side only).
 * Edit this file to match your resume — keep it factual; the model should not invent employers or dates.
 */
export const BEHAVIORAL_RESUME_CONTEXT = `
Candidate: Emmanuel Acheampong
Contact: emmanuelacheampong869@gmail.com · LinkedIn · GitHub

EDUCATION
Grambling State University — B.S. Computer Science, expected May 2027 (Grambling, Louisiana)
Relevant coursework: OOP, Software Engineering, Data Structures & Algorithms, Operating Systems
Awards: Dean’s List 2024–2025, Presidential Scholarship, Vanda African Math Olympiad 2018 Gold Medalist

EXPERIENCE
Geaux Network — Associate Software Developer Intern, May 2025–August 2025, Remote
- Built Change History View (TypeScript, SCSS) consolidating multiple backend event sources for content/media edit traceability
- Java/gRPC/Protocol Buffers API service layer with end-to-end tests; improved data accuracy for podcast ingestion and distribution (10,000+ monthly listeners)
- Interaction logging, accessibility testing, RBAC on key RPC endpoints for creator/admin workflows

Hubtel LTD — Software Engineer Intern, June 2023–September 2023, Ghana
- Real-time data pipeline: Apache Kafka Connect, MQTT, PostgreSQL; reduced downtime detection time ~40%
- 20+ automated unit/integration tests (Spring Boot, JUnit, Postman); improved system reliability ~80% on targeted payment/financial workflows
- Real-time push notifications (Google Firebase) for critical updates with very low latency (sub-10ms where stack allows)

PROJECTS
MedDiagnose AI — Python, TypeScript, FastAPI, TensorFlow, React
- Full-stack stroke diagnosis support: monitoring, RBAC, NIHSS scoring, automated tPA eligibility
- Random Forest on blood sample data (~45% accuracy) as decision support, not autonomous diagnosis
- Louisiana hospital pilot: ~35% reduction in time-to-treatment

VisualizeMyAlgorithm — React.js — 1,000+ learners; Dijkstra, A*, Minimax, neural network visualizations; ~40% faster understanding (informal)

Mini-Compiler — C, C++, Python, Yacc — 50+ developers; lexer/parser/IR, constant folding, dead-code elimination; ~35% less debugging time

LEADERSHIP
NSBE — General Secretary, Jan 2025–present, Grambling — 300+ members, ~$3K technical partnerships
ColorStack member — Winner 2024 Winter Hackathon among ~1,000 participants worldwide

TECHNICAL SKILLS (summary)
Languages: Java, C++, C#, TypeScript, Python, Dart, JavaScript, SQL, Protobuf, HTML/CSS, Rust
Frameworks/tools: React, Spring Boot, Flutter, Flask, Node, TensorFlow, Kafka, Firebase, AWS, Kubernetes, Grafana, CI/CD, gRPC, REST
`.trim()
