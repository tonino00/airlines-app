# AGENTS.md — Project Constitution

> This file is read by Cascade (and any AGENTS.md-aware tool: Claude Code, Cursor, Codex, Gemini CLI) at the start of every session. Keep it short, specific, and current. If a rule isn't being followed, it's probably buried under noise — cut the noise.

---

## Project

**Name:** airlines-app
**One-line purpose:** Frontend React para gerenciamento de airlines e airplanes, consumindo API REST legada
**Stage:** prototype / building from scratch

## Stack

- **Language(s):** JavaScript (ES2022+) → evoluindo para TypeScript
- **Framework:** React 18+ (functional components + hooks)
- **State management**: [Context API / Redux / Outro]
- **Build tool:** Vite
- **Styling**: [CSS Modules / Styled-components / Tailwind]
- **Testing**: [Jest / React Testing Library]
- **HTTP client:** Axios
- **Package manager:** npm (ou pnpm)
- **Deploy target:** Vercel / Netlify / Render (a definir)

## Commands

| What       | Command                                          |
| ---------- | ------------------------------------------------ |
| Install    | `npm install`                                    |
| Dev server | `npm run dev`                                    |
| Test       | `npm test` (Vitest + React Testing Library)      |
| Lint       | `npm run lint` (ESLint)                          |
| Typecheck  | `npm run type-check` (TypeScript, após migração) |
| Build      | `npm run build`                                  |

Run these _yourself_ before declaring a task done. The reviewer and tester subagents will too.

---

## Invariants (Constitution)

These are never negotiable. If a request would violate them, **ask first — don't silently proceed.**

1. **API contract.** Base URL: `https://airline-manager-23mn.onrender.com`. Endpoints: `GET/POST /airlines`, `GET/POST /airplanes`. Always handle 503 (unavailable) with retry + fallback. Never assume API is online.

2. **Resilience.** Every API call must have: timeout (10s), retry mechanism (3 attempts), loading state, and user-friendly error message. Cache GET responses in localStorage with stale-while-revalidate.

3. **Testing.** Every new component gets a test. Coverage stays ≥ 70% on critical paths (API integration, forms, navigation). Never remove a test without justification.

4. **Component purity.** No side effects in render. All side effects go in `useEffect` or custom hooks. No direct DOM manipulation.

5. **State management.** Local state = useState. Shared state = Context API (only if prop drilling > 3 levels). No Redux unless justified.

6. **Accessibility.** All forms have labels. All interactive elements are keyboard-navigable. Use semantic HTML (button, form, ul, etc).

7. **Error boundaries.** Each major feature (Airlines, Airplanes) wrapped in error boundary to prevent total UI crash.

8. **Modern React.** No class components. No legacy lifecycle methods. Use hooks exclusively.

9. **Code review.** Any AI-generated diff over 50 lines gets `@reviewer` pass before commit. Any change to API service layer gets `@security` pass.

10. **Documentation.** Every component > 50 lines has JSDoc explaining props and behavior. Update README when adding new features.

---

## Directory Layout (What Lives Where)

src/
├── api/ # Axios config + API service methods (airlines, airplanes)
├── components/ # Reusable UI components (Button, Card, FormInput, etc)
│ └── common/ # Highly reusable (Modal, Spinner, ErrorBoundary)
├── pages/ # Route-level components (AirlinesPage, AirplanesPage)
├── hooks/ # Custom hooks (useAirlines, useAirplanes, useApi)
├── utils/ # Helpers (error handling, formatters, localStorage)
├── styles/ # Global CSS / Tailwind config
├── mocks/ # Mock data for API offline development
└── types/ # TypeScript interfaces (quando migrar)

tests/
├── unit/ # Component + hook tests
├── integration/ # API integration tests
└── e2e/ # Playwright (future)

vault/ # Agentic wiki — read before API/architecture changes
.windsurf/ # Agent configuration (skills, hooks, workflows)
plans/ # Implementation plans from @architect
templates/ # Component templates (form, list, page)

````

---

## Style

- **Naming:** PascalCase for components, camelCase for functions/variables, kebab-case for CSS classes
- **Formatting:** Prettier with defaults (single quotes, no semicolons, 2 spaces)
- **Comments:** No comments on self-evident code. Only explain *why*, never *what*. JSDoc for public functions.
- **Imports:** Group: React → libraries → internal modules → styles. No dynamic imports inside functions.
- **Error handling:** Always `.catch()` promises or use try/catch in async functions. Never swallow errors silently.
- **File structure:** One component per file. Export default for component, named exports for utils/hooks.

---

## Never Do

- Commit API keys or secrets (use `.env` + `.gitignore`)
- Hardcode URLs (use environment variables: `VITE_API_URL`)
- `console.log` in production code (use `console.error` for errors, `console.warn` for warnings)
- Directly mutate state (`state.push()`) — always use setter
- Ignore failed API calls without user feedback
- Nest ternary operators (> 1 level)
- Use `any` (when TypeScript is added)
- Force push to main branch

## Always Do

- Extract magic strings/numbers to constants (e.g., `API_BASE_URL`, `MAX_RETRIES`)
- Validate form inputs before sending to API
- Show loading spinner during async operations
- Handle offline mode gracefully (show cached data + warning banner)
- Read `vault/INDEX.md` before changing API service layer or architecture
- After adding a new feature, run `npm run lint` and `npm test` locally
- Use `@reviewer` agent before committing any non-trivial change

---

## API-Specific Rules (airlines-app)

### Endpoints contract
```javascript
// Airlines
GET  /airlines → { ok: true, data: Airline[] }
POST /airlines → body: { name, code, country? } → { ok: true, data: Airline }

// Airplanes
GET  /airplanes → { ok: true, data: Airplane[] }
POST /airplanes → body: { model, airlineId, capacity } → { ok: true, data: Airplane }

## Subagents

This repo has 8 role subagents in `.windsurf/agents/`. Invoke by `@<role>`:

| Role | When to use |
|---|---|
| `@architect` | "Help me plan X" — produces a spec/plan before any code |
| `@implementer` | "Implement the plan in `~/.windsurf/plans/X.md`" — SWE 1.6 Fast, terse |
| `@reviewer` | Any non-trivial diff — read-only PR-style feedback |
| `@tester` | "Fill test gaps" / "why does the suite fail?" |
| `@security` | Threat model, vuln scan, auth review |
| `@docs` | README / CHANGELOG / AGENTS.md updates |
| `@perf` | Profiling, benchmarking, regression hunting |
| `@shipper` | PR descriptions, release notes, deploy checklists |

Run them in parallel via [Worktrees](https://github.com/OnlyTerp/windsurf-unlocked#11-worktrees--parallel-cascade) in a single [Space](https://github.com/OnlyTerp/windsurf-unlocked#2-agent-command-center--spaces).

---

## Migration Path

1. Start: JavaScript + functional components + Vite
2. Week 2: Add TypeScript (`.tsx`)
3. Week 3: Add React Query for API caching
4. Week 4: Add E2E tests (Playwright)
5. Week 5: Deploy to Vercel with CI/CD

Always maintain the ability to run with mocks (API offline mode).

---

## Rules Loaded From

- `AGENTS.md` (this file) — project rules, always loaded
- `.windsurfrules` — legacy Windsurf rules, also loaded if present
- `.windsurf/agents/<role>/AGENT.md` — per-subagent personality, loaded on `@<role>` invoke
- `.windsurf/skills/**/SKILL.md` — auto-loaded when the skill's `description:` matches intent
- Cascade Memories (personal, not committed) — loaded via Cascade UI

If any of those contradict this file, **this file wins.**

---

**Last updated:** 2026-01-17
````
