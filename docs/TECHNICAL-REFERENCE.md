# Technical Reference — vinext-boilerplate

> This document is intended for AI assistants or developers who need to understand the full stack, dependencies, file structure, and how every piece connects.

## Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend framework | Vinext | 0.0.15 | Vite plugin that reimplements the Next.js API surface (App Router, RSC, Server Actions) |
| Build tool | Vite | 7.x | ESM-native bundler, HMR, plugin ecosystem |
| UI library | React | 19.x | With React Server Components via `@vitejs/plugin-rsc` |
| Component library | shadcn/ui | manual | Tailwind-based components (Button, Card, Badge, Input, Separator) |
| Styling | Tailwind CSS | 4.x | Via `@tailwindcss/vite` plugin, no config file needed |
| API framework | Hono | 4.x | Lightweight web framework running as Cloudflare Worker |
| Type-safe RPC | tRPC | 11.x | End-to-end type safety between API and frontend |
| Validation | Zod | 4.x | Shared schemas for data validation in API and frontend |
| Client state | TanStack React Query | 5.x | Cache, refetch, mutations for tRPC client components |
| Runtime | Cloudflare Workers | — | Two separate workers: one for web, one for API |
| Package manager | pnpm workspaces | — | Monorepo with three packages |

## Monorepo Structure

```
vinext-boilerplate/
├── package.json                          # Root scripts (dev/build/deploy) for all workspaces
├── pnpm-workspace.yaml                   # Workspace package discovery (packages/*)
├── docs/
│   ├── TECHNICAL-REFERENCE.md            # This file
│   ├── DEPLOYMENT.md                     # How to deploy with wrangler
│   └── CONCEPTS.md                       # Architecture concepts explained
│
├── packages/shared/                      # @vinext-boilerplate/shared
│   ├── package.json                      # Exports: "." and "./models"
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                      # Re-exports everything from models/
│       └── models/
│           ├── index.ts                  # Barrel: user, post, guestbook
│           ├── user.ts                   # UserSchema, CreateUserSchema, UpdateUserSchema + inferred types
│           ├── post.ts                   # PostSchema, CreatePostSchema, UpdatePostSchema + inferred types
│           └── guestbook.ts              # MessageSchema, CreateMessageSchema + inferred types
│
├── packages/api/                         # @vinext-boilerplate/api
│   ├── package.json                      # Exports: "." → src/index.ts (for AppRouter type)
│   ├── tsconfig.json                     # Target: ES2022, types: @cloudflare/workers-types
│   ├── wrangler.jsonc                    # Worker name: vinext-boilerplate-api, port: 8787
│   └── src/
│       ├── index.ts                      # Hono app: CORS, logger, health check, tRPC mount at /trpc/*
│       ├── trpc.ts                       # initTRPC with Context type, exports: router, publicProcedure
│       ├── router.ts                     # appRouter combining users + posts + guestbook, exports AppRouter type
│       └── routers/
│           ├── users.ts                  # CRUD: list, getById, create, update, delete (in-memory Map)
│           ├── posts.ts                  # CRUD + getBySlug, slugify helper (in-memory Map)
│           └── guestbook.ts              # list, create, delete (in-memory Map)
│
└── packages/web/                         # @vinext-boilerplate/web
    ├── package.json                      # Dependencies: react, trpc client, react-query, shadcn deps
    ├── tsconfig.json                     # Paths: @/* → ./* , next → vinext shims, types: vite/client
    ├── vite.config.ts                    # Plugins: vinext(), tailwindcss(), cloudflare() (build only)
    ├── wrangler.jsonc                    # Worker name: vinext-boilerplate, entry: vinext/server/app-router-entry
    ├── next.config.js                    # Empty (vinext compatibility)
    ├── proxy.ts                          # Request logging middleware (vinext convention)
    ├── components.json                   # shadcn/ui configuration
    │
    ├── lib/
    │   ├── utils.ts                      # cn() helper (clsx + tailwind-merge)
    │   ├── trpc.ts                       # Vanilla tRPC client for Server Components (RSC)
    │   └── trpc-react.tsx                # React Query tRPC client + TRPCProvider for Client Components
    │
    ├── components/
    │   ├── page-shell.tsx                # Shared layout: PageShell (back link, title, description) + SectionExplainer
    │   └── ui/                           # shadcn/ui components
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── badge.tsx
    │       ├── input.tsx
    │       └── separator.tsx
    │
    └── app/                              # App Router pages (file-system routing)
        ├── globals.css                   # Tailwind v4 theme: colors (oklch), fonts, animations, custom utilities
        ├── layout.tsx                    # Root: <html>, Google Fonts, TRPCProvider wraps all pages
        ├── page.tsx                      # Homepage: hero, tRPC highlight card, 6 demo cards, stack section
        ├── about/page.tsx                # Static about page
        ├── api/hello/route.ts            # API route handler example
        ├── server-example/
        │   ├── page.tsx                  # RSC: reads process.env, process.pid, memory — zero client JS
        │   └── loading.tsx               # Suspense fallback
        ├── client-example/
        │   ├── page.tsx                  # Wrapper (RSC)
        │   └── counter.tsx               # "use client": useState counter, window/navigator access
        ├── streaming/page.tsx            # Three async components with Suspense (200ms, 1s, 3s)
        ├── error-example/
        │   ├── page.tsx                  # Wrapper
        │   ├── error.tsx                 # "use client" error boundary with reset
        │   └── risky-component.tsx       # "use client" throws on button click
        ├── server-actions/
        │   ├── page.tsx                  # RSC: renders guestbook messages
        │   ├── actions.ts                # "use server": addMessage, deleteMessage, getMessages
        │   └── guestbook-form.tsx        # "use client" form calling server actions
        ├── posts/
        │   ├── page.tsx                  # Post list with links
        │   └── [slug]/
        │       ├── page.tsx              # Dynamic route: params.slug, generateMetadata, notFound()
        │       └── not-found.tsx         # 404 for invalid slugs
        └── trpc-demo/
            ├── page.tsx                  # RSC: server-side tRPC calls (api.users.list.query())
            ├── user-manager.tsx          # "use client": trpc.users.list.useQuery(), create/delete mutations
            └── post-explorer.tsx         # "use client": trpc.posts.list.useQuery(), getBySlug on click
```

## How Everything Connects

### 1. Shared types flow (Zod → API → Frontend)

```
@vinext-boilerplate/shared          @vinext-boilerplate/api           @vinext-boilerplate/web
┌─────────────────────┐             ┌─────────────────────┐           ┌─────────────────────┐
│ UserSchema (Zod)    │──import──→  │ usersRouter uses     │           │                     │
│ CreateUserSchema    │             │ schemas for input    │           │ import type          │
│ type User           │──import──→  │ validation           │           │ { CreateUser }       │
│ type CreateUser     │             │                      │           │ from shared          │
└─────────────────────┘             │ AppRouter = typeof   │──type──→  │                     │
                                    │   appRouter          │  import   │ createTRPCClient     │
                                    └─────────────────────┘           │ <AppRouter>          │
                                                                      └─────────────────────┘
```

### 2. tRPC connection (API ↔ Frontend)

**Server-side (RSC):** `lib/trpc.ts` creates a vanilla `createTRPCClient<AppRouter>` that calls `http://localhost:8787/trpc` (or `VITE_API_URL`). Used directly in async page components:

```typescript
// app/trpc-demo/page.tsx (Server Component)
const users = await api.users.list.query();
```

**Client-side:** `lib/trpc-react.tsx` creates `createTRPCReact<AppRouter>` with React Query. The `TRPCProvider` wraps the app in `layout.tsx`. Client components use hooks:

```typescript
// app/trpc-demo/user-manager.tsx ("use client")
const users = trpc.users.list.useQuery();
const createUser = trpc.users.create.useMutation();
```

### 3. Hono + tRPC mount

The Hono app in `packages/api/src/index.ts` mounts tRPC at `/trpc/*` using `@hono/trpc-server`. Regular Hono routes (health check at `/`) coexist alongside tRPC. CORS is configured to allow the frontend origins.

### 4. Vite + Vinext + Cloudflare

`vite.config.ts` loads two plugins:
- `vinext()` — provides Next.js API shims (App Router, RSC, Server Actions, metadata)
- `tailwindcss()` — Tailwind v4 via Vite plugin

During `build` only, `@cloudflare/vite-plugin` is added to bundle for Workers deployment.

The `tsconfig.json` paths map `next` and `next/*` to `vinext/dist/shims/*`, so `import Link from "next/link"` resolves to vinext's implementation.

### 5. Environment variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_API_URL` | Frontend (client + server) | API worker URL. Default: `http://localhost:8787` |

In Vite, only `VITE_` prefixed variables are exposed to client code via `import.meta.env`. Do NOT use `process.env.NEXT_PUBLIC_*` (that's Next.js convention, not Vite).

## Key Dependencies by Package

### @vinext-boilerplate/shared
- `zod` — schema definition and runtime validation

### @vinext-boilerplate/api
- `hono` — HTTP framework
- `@trpc/server` — tRPC server-side (router, procedures, middleware)
- `@hono/trpc-server` — adapter to mount tRPC inside Hono
- `@vinext-boilerplate/shared` — Zod schemas for input validation
- `wrangler` (dev) — Cloudflare Workers CLI

### @vinext-boilerplate/web
- `vinext` (dev) — Vite plugin providing Next.js API surface
- `vite` (dev) — Build tool
- `@cloudflare/vite-plugin` (dev) — Workers deployment integration
- `react`, `react-dom` — UI library (v19 with RSC support)
- `@trpc/client` — vanilla tRPC client for Server Components
- `@trpc/react-query` — React Query integration for Client Components
- `@tanstack/react-query` — client-side cache and state
- `@vinext-boilerplate/api` — type-only import of AppRouter
- `@vinext-boilerplate/shared` — Zod types for forms
- `tailwindcss`, `@tailwindcss/vite` — CSS framework
- `class-variance-authority`, `clsx`, `tailwind-merge` — shadcn/ui utilities
- `@radix-ui/react-slot` — shadcn Button component primitive
- `lucide-react` — icon library
