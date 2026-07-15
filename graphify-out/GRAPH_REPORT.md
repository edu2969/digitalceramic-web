# Graph Report - digitalceramic-web  (2026-07-14)

## Corpus Check
- 105 files · ~1,341,654 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 533 nodes · 772 edges · 34 communities (23 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `58c4b31b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- createClient
- Perfil.tsx
- route.ts
- dependencies
- compilerOptions
- Caso.tsx
- AutoField.tsx
- devDependencies
- Landing.tsx
- route.ts
- route.ts
- QueryProvider.tsx
- route.ts
- RutInput.tsx
- ClientJobs.tsx
- StepBasicInformation.tsx
- layout.tsx
- route.ts
- proxy.ts
- route.ts
- layout.tsx
- page.tsx
- README.md
- route.js
- AGENTS.md
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- CLAUDE.md
- copilot-instructions.md
- db_rls.sql
- db_schema.sql

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 30 edges
2. `compilerOptions` - 16 edges
3. `useAutoSaveContext()` - 12 edges
4. `createClient()` - 11 edges
5. `UploadFormValues` - 10 edges
6. `Estado` - 10 edges
7. `GET()` - 9 edges
8. `include` - 9 edges
9. `isEstado()` - 8 edges
10. `QueryProvider()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AuthLayout()` --calls--> `createClient()`  [EXTRACTED]
  app/(auth)/layout.tsx → lib/supabase/server.ts
- `GET()` --calls--> `createClient()`  [EXTRACTED]
  app/api/auth/confirm/route.ts → lib/supabase/server.ts
- `requireUser()` --calls--> `createClient()`  [EXTRACTED]
  app/api/profile/me/route.ts → lib/supabase/server.ts
- `PATCH()` --calls--> `isEstado()`  [EXTRACTED]
  app/api/trabajos/byId/[...id]/route.ts → lib/estado.ts
- `POST()` --calls--> `createClient()`  [EXTRACTED]
  app/api/upload-case/download-url/route.ts → lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (34 total, 11 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.10
Nodes (36): FlushOnStepChange(), ColorSectionEditor(), PieceCard(), SECTION_LABELS, PieceCardProps, getAdjacentPieces(), isExtremePiece(), StepPieceSelection() (+28 more)

### Community 1 - "createClient"
Cohesion: 0.08
Nodes (28): GET(), admin, CreateClinicaBody, GET(), POST(), requireUser(), admin, CreatePacienteBody (+20 more)

### Community 2 - "Perfil.tsx"
Cohesion: 0.09
Nodes (25): admin, GET(), PATCH(), PatchBody, requireUser(), serializeProfile(), signAvatar(), ForgotPassword() (+17 more)

### Community 3 - "route.ts"
Cohesion: 0.08
Nodes (32): daysDiff(), formatDate(), GET(), MONTHS_ES, supabase, TrabajoRow, TYPE_LABEL, formatDate() (+24 more)

### Community 4 - "dependencies"
Cohesion: 0.06
Nodes (35): framer-motion, lodash, next, nodemailer, dependencies, framer-motion, lodash, next (+27 more)

### Community 5 - "compilerOptions"
Cohesion: 0.06
Nodes (32): ./*, app/api/upload-case/route.ts, components/Nav.jsx, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts (+24 more)

### Community 6 - "Caso.tsx"
Cohesion: 0.10
Nodes (24): fetchWork(), Transition, transitionFor(), transitionPagoFor(), WorkColor, WorkDetail, WorkFile, WorkPagePage() (+16 more)

### Community 7 - "AutoField.tsx"
Cohesion: 0.07
Nodes (28): AutoTextarea(), AutoTextareaProps, useAutoSaveContext(), AutoSavePayload, Options, SaveFn, useAutoSaveEngine(), usePieceAutoSave() (+20 more)

### Community 8 - "devDependencies"
Cohesion: 0.07
Nodes (29): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/lodash (+21 more)

### Community 9 - "Landing.tsx"
Cohesion: 0.10
Nodes (12): Club(), ComoFunciona(), pasos, Landing(), Services(), Countdown(), CountdownProps, getRemainingTime() (+4 more)

### Community 10 - "route.ts"
Cohesion: 0.15
Nodes (17): bad(), POST(), bad(), POST(), calcularMontoTotal(), calcularMontoTotalSimple(), PRECIOS, MATERIAL_BY_TYPE (+9 more)

### Community 11 - "route.ts"
Cohesion: 0.14
Nodes (19): approxBirthDateFromAge(), bad(), ColorPayload, CommitPayload, MATERIAL_BY_TYPE, PALETTE_LABELS, PatientInfo, PiecePayload (+11 more)

### Community 12 - "QueryProvider.tsx"
Cohesion: 0.19
Nodes (3): AuthLayout(), SearchParams, QueryProvider()

### Community 13 - "route.ts"
Cohesion: 0.21
Nodes (11): bad(), extOf(), POST(), sanitizeFileName(), SignedTarget, SignRequest, SignResponse, Slot3D (+3 more)

### Community 14 - "RutInput.tsx"
Cohesion: 0.21
Nodes (7): FormState, calculateDV(), cleanRut(), formatRut(), isValidRut(), RutInput, RutInputProps

### Community 15 - "ClientJobs.tsx"
Cohesion: 0.20
Nodes (4): activeJobs, historyJobs, Job, JobStatus

### Community 16 - "StepBasicInformation.tsx"
Cohesion: 0.17
Nodes (8): Option, Props, ageFromBirthDate(), fetchProfile(), ProfileResponse, StepBasicInformation(), AutocompleteOption, splitFullName()

### Community 18 - "route.ts"
Cohesion: 0.40
Nodes (3): admin, resend, SignupBody

### Community 19 - "proxy.ts"
Cohesion: 0.60
Nodes (3): updateSession(), config, proxy()

### Community 23 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 33 - "db_rls.sql"
Cohesion: 0.33
Nodes (6): public.clinica, public.current_user_role(), public.pacientes, public.piezas, public.profiles, public.trabajos

### Community 34 - "db_schema.sql"
Cohesion: 0.60
Nodes (5): public.clinica, public.pacientes, public.piezas, public.profiles, public.trabajos

## Knowledge Gaps
- **186 isolated node(s):** `SearchParams`, `admin`, `resend`, `SignupBody`, `admin` (+181 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `Perfil.tsx`, `route.ts`, `route.ts`, `route.ts`, `QueryProvider.tsx`, `route.ts`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `Estado` connect `Caso.tsx` to `route.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `SearchParams`, `admin`, `resend` to the rest of the system?**
  _186 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09696969696969697 - nodes in this community are weakly interconnected._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.0753045404208195 - nodes in this community are weakly interconnected._
- **Should `Perfil.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09024390243902439 - nodes in this community are weakly interconnected._
- **Should `route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08403361344537816 - nodes in this community are weakly interconnected._