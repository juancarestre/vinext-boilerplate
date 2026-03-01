# Conceptos — vinext-boilerplate

Guía para entender la arquitectura, las decisiones de diseño, y cómo encaja cada pieza.

## La idea general

Este proyecto es un **monorepo full-stack** que corre enteramente en Cloudflare Workers:

```
┌──────────────┐     HTTP/tRPC      ┌──────────────┐
│   Frontend   │ ←────────────────→ │   Backend    │
│   (Vinext)   │                    │ (Hono+tRPC)  │
│   Worker #1  │                    │  Worker #2   │
└──────────────┘                    └──────────────┘
        │                                   │
        └───────── Shared Types ────────────┘
                (@vinext-boilerplate/shared)
```

Dos workers independientes que comparten tipos via un paquete común.

## Monorepo: por qué y cómo

### Qué es
Un solo repositorio con múltiples paquetes que se pueden referenciar entre sí. Usamos **pnpm workspaces** para resolver dependencias internas de forma local y eficiente.

### Los 3 paquetes

| Paquete | Qué hace | Se despliega? |
|---------|----------|---------------|
| `packages/shared` | Define los modelos de datos (schemas Zod + tipos TypeScript) | No — es código que importan los otros dos |
| `packages/api` | El backend: recibe requests, valida, procesa, responde | Sí — como Cloudflare Worker |
| `packages/web` | El frontend: renderiza páginas, llama al API | Sí — como Cloudflare Worker |

### Cómo se conectan
En `pnpm-workspace.yaml` definimos `packages/*`. Esto le dice a pnpm que los paquetes dentro de `packages/` se pueden importar entre sí como si fueran librerías publicadas, pero sin publicar nada: la resolución es local.

Cuando en el API escribes `import { UserSchema } from "@vinext-boilerplate/shared"`, pnpm resuelve eso al código fuente en `packages/shared/src/`.

## Vinext: qué es y por qué

### El problema
Next.js es el framework React más popular, pero usa su propio bundler (webpack/turbopack), su propio dev server, y desplegarlo en Cloudflare Workers requiere una capa de adaptación compleja (OpenNext).

### La solución de Vinext
Vinext es un **plugin de Vite** que reimplementa la API de Next.js. Escribes código "como si fuera Next.js" (App Router, `page.tsx`, `layout.tsx`, `"use client"`, Server Actions), pero por debajo corre Vite, que es más rápido y despliega nativamente en Workers.

### Qué significa en la práctica
- Escribes `import Link from "next/link"` → Vinext tiene un shim que provee la misma API
- Creas `app/posts/[slug]/page.tsx` → Vinext lo convierte en una ruta dinámica
- Usas `export const metadata` → Vinext genera los meta tags
- El dev server es Vite (HMR instantáneo), no webpack

### Limitación importante
Vinext es muy nuevo (v0.0.15). Cubre ~94% de la API de Next.js pero puede fallar en edge cases. Para producción crítica, OpenNext (Next.js real adaptado a Workers) es más seguro.

## Hono: el framework del API

### Qué es
Hono es un framework HTTP ultraligero diseñado para edge runtimes (Cloudflare Workers, Deno, Bun). Es como Express pero moderno, tipado, y pesa ~14KB.

### Cómo se usa aquí
```
Hono app
├── Middleware: logger() → logea cada request
├── Middleware: cors() → permite requests del frontend
├── GET / → health check (JSON con status y timestamp)
└── /trpc/* → tRPC handler (toda la lógica de negocio)
```

Hono actúa como el "servidor HTTP" que recibe requests y las enruta. Las rutas de negocio (users, posts, guestbook) están en tRPC, no en rutas Hono directas.

## tRPC: type safety end-to-end

### El concepto
Normalmente cuando tu frontend llama a un API, tienes que:
1. Definir la ruta en el backend
2. Definir los tipos del request/response
3. En el frontend, crear funciones que hagan fetch y parseen la respuesta
4. Mantener todo sincronizado manualmente

Con tRPC, **el tipo del API se infiere automáticamente**. Cambias algo en el backend y TypeScript te avisa en el frontend si algo se rompió.

### Cómo funciona en este proyecto

**Paso 1 — El backend define "procedures":**
```typescript
// packages/api/src/routers/users.ts
export const usersRouter = router({
  list: publicProcedure.query(() => {
    return Array.from(users.values());
  }),
  create: publicProcedure
    .input(CreateUserSchema)        // ← validación Zod
    .mutation(({ input }) => { ... }),
});
```

**Paso 2 — Los routers se combinan:**
```typescript
// packages/api/src/router.ts
export const appRouter = router({
  users: usersRouter,
  posts: postsRouter,
  guestbook: guestbookRouter,
});
export type AppRouter = typeof appRouter;  // ← ESTE TIPO es la magia
```

**Paso 3 — El frontend importa el tipo (no el código):**
```typescript
// packages/web/lib/trpc.ts
import type { AppRouter } from "@vinext-boilerplate/api";
const api = createTRPCClient<AppRouter>({ ... });
```

`import type` solo importa información de tipos — se borra en compile time. No hay código del API en el bundle del frontend.

**Paso 4 — El frontend llama con autocompletado completo:**
```typescript
const users = await api.users.list.query();
//                  ↑       ↑      ↑
//                  │       │      └── query() = GET, mutation() = POST
//                  │       └── nombre del procedure
//                  └── nombre del router
```

Si cambias el schema de `users.list` en el backend, TypeScript te marca error en el frontend inmediatamente.

### Queries vs Mutations

| Concepto | Equivalente REST | Uso |
|----------|-----------------|-----|
| `query` | GET | Leer datos (list, getById) |
| `mutation` | POST/PUT/DELETE | Modificar datos (create, update, delete) |

### Dos formas de usar tRPC en el frontend

1. **Vanilla client** (`lib/trpc.ts`) → para Server Components (RSC). Se ejecuta en el servidor, no llega JS al navegador:
   ```typescript
   const users = await api.users.list.query();
   ```

2. **React Query client** (`lib/trpc-react.tsx`) → para Client Components. Provee hooks con loading states, cache, refetch:
   ```typescript
   const { data, isLoading } = trpc.users.list.useQuery();
   const createUser = trpc.users.create.useMutation();
   ```

## Zod: la capa de validación compartida

### Qué es
Zod es una librería de validación que define schemas y **infiere tipos TypeScript automáticamente**.

### Por qué está en `packages/shared`
Los schemas definen la "forma" de los datos (User, Post, Message). Esa definición es útil en dos lugares:
- **API**: para validar los inputs de cada procedure (`publicProcedure.input(CreateUserSchema)`)
- **Frontend**: para tipar formularios y responses

Al estar en un paquete compartido, hay **una sola fuente de verdad** para la estructura de datos.

### Cómo funciona

```typescript
// Un schema define la estructura Y genera el tipo
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "user", "viewer"]),
  createdAt: z.string().datetime(),
});

// El tipo se infiere automáticamente — no hay que definirlo a mano
export type User = z.infer<typeof UserSchema>;
// Equivale a: { id: string; name: string; email: string; role: "admin"|"user"|"viewer"; createdAt: string }

// Schemas derivados
export const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true });
// → { name: string; email: string; role: "admin"|"user"|"viewer" }
```

## React Server Components vs Client Components

### Server Components (por defecto)
Todo archivo `.tsx` en `app/` es un Server Component a menos que tenga `"use client"` al inicio. Se ejecutan **solo en el servidor**:
- Pueden hacer `await` directamente
- Pueden acceder a `process.env`, bases de datos, filesystem
- No envían JavaScript al navegador
- No pueden usar `useState`, `useEffect`, event handlers

### Client Components (`"use client"`)
Archivos con `"use client"` se ejecutan en el **navegador**:
- Tienen interactividad (clicks, forms, state)
- Acceso a APIs del browser (window, navigator, localStorage)
- El JavaScript SÍ se envía al navegador
- Se hidratan sobre el HTML que el servidor pre-renderizó

### Patrón en este proyecto
La página (`page.tsx`) suele ser RSC, e importa componentes client cuando necesita interactividad:

```
page.tsx (Server Component)
├── Hace fetch de datos en el servidor
├── Renderiza HTML estático
└── Importa <UserManager /> ("use client")
    └── Tiene hooks, buttons, forms
```

## React Query: cache y estado del cliente

### Qué resuelve
Sin React Query, cada vez que un Client Component necesita datos, haría un fetch manual, manejaría loading/error states a mano, y no habría cache.

### Cómo funciona con tRPC

```typescript
const users = trpc.users.list.useQuery();
// users.data → los datos (o undefined mientras carga)
// users.isLoading → true mientras hace el primer fetch
// users.error → el error si falló
// users.refetch() → volver a pedir

const createUser = trpc.users.create.useMutation({
  onSuccess: () => users.refetch(),  // actualiza la lista al crear
});
// createUser.mutate(data) → ejecuta la mutation
// createUser.isPending → true mientras ejecuta
```

React Query cachea los resultados, evita requests duplicados, y hace refetch automático cuando la ventana recupera el foco.

## Tailwind CSS v4 + shadcn/ui

### Tailwind v4
A diferencia de Tailwind v3 que necesitaba `tailwind.config.js`, Tailwind v4 se configura directamente en CSS con `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.72 0.17 50);
  --font-sans: "Outfit", system-ui, sans-serif;
}
```

Se integra via el plugin de Vite `@tailwindcss/vite` — no necesita PostCSS.

### shadcn/ui
No es una librería npm — los componentes se copian directamente en tu proyecto (`components/ui/`). Esto te da control total sobre el código. Los componentes usan:
- `class-variance-authority` (cva) para variants (button sizes, colors)
- `clsx` + `tailwind-merge` para combinar clases CSS
- `@radix-ui/*` para primitivas accesibles (solo el Slot por ahora)
- `lucide-react` para iconos

## Cloudflare Workers

### Qué son
Funciones que corren en el edge de Cloudflare (300+ ciudades). No hay servidor, no hay cold starts, cada request se atiende en la ubicación más cercana al usuario.

### Este proyecto tiene 2 Workers
Son completamente independientes — se escalan, despliegan, y monitorean por separado. Se comunican via HTTP (el frontend hace fetch al API worker).

### Wrangler
Es el CLI de Cloudflare para desarrollar y desplegar Workers. Cada paquete tiene su `wrangler.jsonc`:
- `name` — nombre del worker en Cloudflare
- `main` — el entry point del código
- `compatibility_date` — qué APIs de Workers están disponibles
- `compatibility_flags` — features extra como `nodejs_compat_v2`

## Flujo de un request completo

### Ejemplo: usuario abre /trpc-demo

1. **Browser** → request a `https://vinext-boilerplate.workers.dev/trpc-demo`
2. **Web Worker** recibe el request, ejecuta el Server Component `trpc-demo/page.tsx`
3. **page.tsx** (RSC) llama `api.users.list.query()` → HTTP request a `https://vinext-boilerplate-api.workers.dev/trpc/users.list`
4. **API Worker** recibe, Hono rutea a `/trpc/*`, tRPC ejecuta `usersRouter.list`
5. **API** responde JSON con la lista de usuarios
6. **page.tsx** renderiza el HTML con los datos + los Client Components (`user-manager.tsx`, `post-explorer.tsx`)
7. **Browser** recibe HTML + JS bundles, React hidrata los Client Components
8. **user-manager.tsx** ejecuta `trpc.users.list.useQuery()` → otro HTTP request al API Worker
9. **React Query** cachea la respuesta, renderiza la lista interactiva
