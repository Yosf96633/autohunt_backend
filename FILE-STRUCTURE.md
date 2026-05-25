autohunt/
├── src/
│   ├── main.ts                          # Express app entry point
│   │
│   ├── routes/
│   │   └── agent.routes.ts             # POST /run-agent, GET /status/:runId, POST /resume/:runId
│   │
│   ├── controllers/
│   │   └── agent.controller.ts         # Request handling, validation, response shaping
│   │
│   ├── services/
│   │   ├── agent.service.ts            # Invokes LangGraph, manages run lifecycle
│   │   ├── cv.service.ts               # PDF parsing + LLM structured extraction
│   │   ├── scraper.service.ts          # Job board API calls (RemoteOK, Arbeitnow)
│   │   ├── scorer.service.ts           # LLM scoring logic per job
│   │   ├── coverLetter.service.ts      # Cover letter generation + critic loop
│   │   ├── tracker.service.ts          # SQLite read/write for job tracking
│   │   └── digest.service.ts           # Summary email composition + sending
│   │
│   ├── graph/
│   │   ├── graph.ts                    # StateGraph definition, node wiring, edges
│   │   ├── state.ts                    # AgentState TypedDict / Annotation definition
│   │   └── nodes/
│   │       ├── cvParser.node.ts        # Node 1 — PDF → structured JSON
│   │       ├── scraper.node.ts         # Node 2 — fetch raw jobs
│   │       ├── scorer.node.ts          # Node 3 — score each job vs CV
│   │       ├── filter.node.ts          # Node 4 — threshold filtering
│   │       ├── coverLetter.node.ts     # Node 5 — write cover letters
│   │       ├── critic.node.ts          # Node 6 — review + rewrite
│   │       ├── humanCheck.node.ts      # Node 7 — interrupt() if auto_apply OFF
│   │       ├── applicator.node.ts      # Node 8 — Playwright form submission
│   │       ├── tracker.node.ts         # Node 9 — log to SQLite
│   │       └── digest.node.ts          # Node 10 — send summary email
│   │
│   ├── tools/
│   │   ├── playwright.tool.ts          # Browser automation tool wrapper
│   │   └── email.tool.ts              # Email sending tool wrapper
│   │
│   ├── validators/
│   │   └── agent.validator.ts          # Zod schemas for CV + preferences validation
│   │
│   ├── types/
│   │   ├── agent.types.ts             # AgentState, ParsedCV, RawJob, ScoredJob types
│   │   └── preferences.types.ts       # UserPreferences type
│   │
│   ├── db/
│   │   ├── schema.ts                  # SQLite table definitions
│   │   └── client.ts                  # DB connection (better-sqlite3)
│   │
│   ├── config/
│   │   └── env.ts                     # All env vars with zod validation
│   │
│   └── utils/
│       ├── pdf.utils.ts               # PDF buffer to text extraction (pdf-parse)
│       ├── logger.ts                  # Winston logger
│       └── runStore.ts                # In-memory run status map (runId → status)
│
├── uploads/                           # Temp CV uploads (multer destination)
├── .env
├── .gitignore
├── tsconfig.json
└── package.json