# CLAUDE.md

## Project Overview

Acorn Brokers Applications is a multi-step insurance application form for firearm legal and liability cover in South Africa. It is a single-page application (SPA) built with React, TypeScript, and Vite, backed by Supabase (PostgreSQL + Edge Functions). The project is also integrated with the Lovable.dev development platform.

**Business context:** Acorn Brokers (FSP #47433) offers two cover tiers — Essential (R135/month) and Comprehensive (R245/month) — with POPIA-compliant data handling for South African applicants.

## Tech Stack

- **Frontend:** React 18, TypeScript 5.8, Vite 5.4 (SWC compiler)
- **Routing:** React Router DOM 6
- **State/Data:** TanStack React Query 5, React Hook Form 7, Zod validation
- **UI Components:** shadcn-ui (Radix UI primitives + Tailwind CSS 3.4)
- **Icons:** Lucide React
- **Backend:** Supabase (PostgreSQL, Edge Functions via Deno)
- **PDF Generation:** jsPDF
- **Package Manager:** npm (also has bun.lockb)

## Project Structure

```
├── public/                     # Static assets (favicon, robots.txt)
├── src/
│   ├── assets/                 # Brand assets (acorn-logo.png)
│   ├── components/
│   │   ├── application/        # Multi-step form components (Steps 1-5)
│   │   ├── ui/                 # shadcn-ui component library (~60 components)
│   │   ├── Header.tsx          # Sticky header with logo and step indicator
│   │   ├── Footer.tsx          # Footer with FSP number and legal links
│   │   └── Layout.tsx          # Main layout wrapper
│   ├── hooks/                  # Custom React hooks (use-mobile, use-toast)
│   ├── integrations/supabase/  # Supabase client and auto-generated types
│   ├── lib/
│   │   ├── apiClient.ts        # Edge Function API calls (create, update, email)
│   │   ├── coverData.ts        # Cover option definitions and pricing
│   │   ├── pdfGenerator.ts     # PDF generation for application confirmation
│   │   ├── sessionManager.ts   # Session state and JWT token management
│   │   ├── utils.ts            # cn() utility for Tailwind class merging
│   │   └── validations.ts      # Zod schemas for all form steps
│   ├── pages/                  # Route pages (Index, Privacy, Terms, Contact, NotFound)
│   ├── App.tsx                 # Root component with providers and routes
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles and CSS custom properties
├── supabase/
│   ├── functions/
│   │   ├── generate-session-token/  # Creates JWT + applicant record
│   │   ├── update-application/      # Verifies JWT and updates applicant data
│   │   ├── send-application-email/  # Generates PDF and sends confirmation email
│   │   └── _shared/                 # Shared types and PDF utilities
│   ├── migrations/             # PostgreSQL schema migrations
│   └── config.toml             # Supabase project configuration
├── vite.config.ts              # Vite config (port 8080, @ path alias)
├── tailwind.config.ts          # Tailwind with custom Acorn theme
├── tsconfig.json               # TypeScript config (lenient, @ path alias)
├── eslint.config.js            # ESLint with React hooks + refresh plugins
└── components.json             # shadcn-ui configuration
```

## Commands

```bash
npm run dev        # Start Vite dev server on port 8080
npm run build      # Production build (vite build)
npm run build:dev  # Development build (vite build --mode development)
npm run lint       # Run ESLint across the project
npm run preview    # Preview production build locally
```

There is no test suite configured. No test runner, test files, or testing libraries are present.

## Application Architecture

### Multi-Step Form Flow

The main application (`src/pages/Index.tsx`) is a 5-step wizard:

1. **Eligibility** — Firearm licence status and referral source
2. **Personal Details** — Name, SA ID (13 digits, no Luhn check), contact info, address
3. **Cover Selection** — Essential (Option A) or Comprehensive (Option B)
4. **Banking Details** — Bank account info for debit order
5. **Authorisations** — Consent checkboxes (debit order, declaration, POPIA)

Each step has a dedicated component in `src/components/application/` and a Zod validation schema in `src/lib/validations.ts`. Form state is managed with React Hook Form and accumulated in `applicationData` state on the Index page.

### Security Model (Token-Based Anonymous Flow)

There is no user authentication. The app uses a JWT-based session flow:

1. **Step 1 submission** calls the `generate-session-token` Edge Function, which creates the applicant record and returns a signed JWT (24-hour expiry)
2. **Subsequent steps** call `update-application` with the JWT; the Edge Function verifies the signature before updating
3. **Final submission** calls `send-application-email` with the token in an `x-session-token` header
4. **RLS policies** block all direct client access to the `applicants` table; only Edge Functions using the service role key can read/write

Session tokens are stored in `sessionStorage` via `src/lib/sessionManager.ts`.

### Database

Single `applicants` table in Supabase PostgreSQL. Key enums:

- `firearm_licence_status`: `valid`, `in_progress`
- `source`: `online`, `agent`, `referral`, `other`
- `cover_option`: `option_a`, `option_b`
- `status`: `partial`, `complete`

Migrations are in `supabase/migrations/`. An `update_updated_at_column()` trigger auto-updates timestamps.

### Supabase Edge Functions

Edge Functions are written in TypeScript for Deno runtime. They are located in `supabase/functions/` and all have `verify_jwt = false` in `config.toml` (they handle their own JWT verification using `SESSION_JWT_SECRET`).

Required Supabase environment secrets (not in repo):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_JWT_SECRET`

### Routing

Defined in `src/App.tsx`:

| Path | Page |
|------|------|
| `/` | Index (main application form) |
| `/privacy` | Privacy policy (POPIA) |
| `/terms` | Terms of service |
| `/contact` | Contact form |
| `*` | 404 Not Found |

## Coding Conventions

### Path Aliases

Use `@/` to import from `src/`. Configured in both `tsconfig.json` and `vite.config.ts`.

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### TypeScript

TypeScript is configured in lenient mode:
- `strict: false`
- `noImplicitAny: false`
- `strictNullChecks: false`
- `@typescript-eslint/no-unused-vars` is disabled in ESLint

### UI Components

- All UI primitives live in `src/components/ui/` and come from shadcn-ui (Radix + Tailwind)
- Use `cn()` from `@/lib/utils` to merge Tailwind classes
- Styling is done exclusively with Tailwind utility classes
- Custom theme colors are defined as CSS custom properties in `src/index.css` and mapped in `tailwind.config.ts`
- Font: Inter (loaded from Google Fonts)

### Form Validation

- All validation schemas are centralized in `src/lib/validations.ts` using Zod
- SA-specific validation: provinces, banks, mobile numbers (`+27` / `0` prefix), 13-digit ID numbers
- React Hook Form integrates with Zod via `@hookform/resolvers`

### API Communication

- All backend calls go through `src/lib/apiClient.ts`
- Calls target Supabase Edge Functions at `VITE_SUPABASE_URL/functions/v1/<function-name>`
- The Supabase JS client (`src/integrations/supabase/client.ts`) is initialized but database access is blocked by RLS; it is primarily available for any future authenticated features

### Agent Attribution

URL query parameters `?agent=`, `?agent_id=`, or `?ref=` are captured on page load and stored in the session for tracking referral sources.

## Environment Variables

Frontend (prefixed with `VITE_`, safe to expose):
- `VITE_SUPABASE_PROJECT_ID` — Supabase project identifier
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key
- `VITE_SUPABASE_URL` — Supabase API endpoint

Backend (Supabase secrets, never committed):
- `SUPABASE_URL` — Supabase service URL
- `SUPABASE_SERVICE_ROLE_KEY` — Admin key for bypassing RLS
- `SESSION_JWT_SECRET` — Secret for signing/verifying session JWTs

## Deployment

The project is designed for deployment via Lovable.dev (Share > Publish). It can also be deployed to any static hosting provider since the build output is a standard SPA. There is no CI/CD pipeline in the repository.
