# Deployment Guide — vinext-boilerplate

Guía paso a paso para desplegar ambos workers (API y web) a Cloudflare.

## Prerequisitos

1. **Cuenta de Cloudflare** con Workers habilitado
2. **Wrangler CLI** (ya incluido como devDependency en cada paquete)
3. **Node.js 18+** instalado
4. Estar autenticado con Cloudflare:

```bash
npx wrangler login
```

Esto abre el navegador para autorizar. Solo necesitas hacerlo una vez.

## Estructura de Workers

Este proyecto despliega **2 workers independientes**:

| Worker | Nombre | Paquete | Puerto dev |
|--------|--------|---------|------------|
| API | `vinext-boilerplate-api` | `packages/api` | 8787 |
| Web | `vinext-boilerplate` | `packages/web` | 5173 |

Cada uno tiene su propio `wrangler.jsonc` con su configuración.

## Paso 1: Instalar dependencias

```bash
pnpm install
```

Esto instala todo el monorepo (shared, api, web) gracias a pnpm workspaces.

## Paso 2: Desplegar el API Worker

```bash
pnpm run deploy:api
```

Esto ejecuta `wrangler deploy` en el paquete API. Wrangler:
1. Transpila `src/index.ts` y sus dependencias (Hono, tRPC, shared schemas)
2. Sube el bundle al edge de Cloudflare
3. Te da una URL: `https://vinext-boilerplate-api.<tu-subdomain>.workers.dev`

**Guarda esa URL** — la necesitas para el siguiente paso.

## Paso 3: Configurar la URL del API en el frontend

Crea un archivo `.env` en `packages/web/`:

```bash
# packages/web/.env
VITE_API_URL=https://vinext-boilerplate-api.<tu-subdomain>.workers.dev
```

O si usas un custom domain:

```bash
VITE_API_URL=https://api.tudominio.com
```

## Paso 4: Desplegar el Web Worker

```bash
pnpm run deploy:web
```

Esto ejecuta `vite build && wrangler deploy` en el paquete web. El proceso:
1. Vite compila el frontend (RSC, SSR, client bundles)
2. `@cloudflare/vite-plugin` prepara el output para Workers
3. Wrangler sube el worker + assets estáticos
4. Te da una URL: `https://vinext-boilerplate.<tu-subdomain>.workers.dev`

## Paso 5: Actualizar CORS en el API

Después del primer deploy, actualiza los origins permitidos en `packages/api/src/index.ts`:

```typescript
cors({
  origin: [
    "http://localhost:5173",                    // dev
    "https://vinext-boilerplate.<tu-subdomain>.workers.dev",  // producción
    "https://app.tudominio.com",                // custom domain (si aplica)
  ],
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type"],
})
```

Luego re-despliega el API:

```bash
pnpm run deploy:api
```

## Deploy todo de una vez

Puedes desplegar ambos workers con un solo comando:

```bash
pnpm run deploy
```

Esto ejecuta `pnpm -r --if-present deploy`, que despliega cada paquete que tenga script `deploy`.

**Importante**: Asegúrate de tener `VITE_API_URL` configurado en `packages/web/.env` ANTES de ejecutar esto, porque el build del frontend necesita saber la URL del API.

## Deploy con integración Cloudflare + GitHub (monorepo con 2 workers)

Conecta **dos proyectos Workers distintos** al mismo repositorio de GitHub (uno para `api` y otro para `web`).

### Worker API (`vinext-boilerplate-api`)
1. En Cloudflare Workers, crea/conecta el worker al repo.
2. Configura:
   - **Root directory**: `packages/api`
   - **Build command**: `pnpm -C ../.. install --frozen-lockfile`
   - **Deploy command**: `pnpm -C ../.. run deploy:api`

### Worker Web (`vinext-boilerplate`)
1. Crea/conecta un segundo worker al mismo repo.
2. Configura:
   - **Root directory**: `packages/web`
   - **Build command**: `pnpm -C ../.. install --frozen-lockfile`
   - **Deploy command**: `pnpm -C ../.. run deploy:web`

Con `pnpm -C ../..` ejecutas los comandos desde la raíz del monorepo para que funcionen las dependencias internas `workspace:*`.

## Custom Domains

Para asociar un dominio personalizado a cada worker:

### Via Cloudflare Dashboard
1. Ve a Workers & Pages → tu worker → Settings → Triggers
2. Agrega un Custom Domain (tu dominio debe estar en Cloudflare DNS)

### Via wrangler.jsonc
Agrega `routes` al wrangler.jsonc correspondiente:

```jsonc
// packages/api/wrangler.jsonc
{
  "routes": [
    { "pattern": "api.tudominio.com", "custom_domain": true }
  ]
}

// packages/web/wrangler.jsonc
{
  "routes": [
    { "pattern": "app.tudominio.com", "custom_domain": true }
  ]
}
```

## Variables de entorno en producción

Para setear variables de entorno (secrets) en el worker desplegado:

```bash
# Para el API worker
pnpm --filter @vinext-boilerplate/api exec wrangler secret put API_KEY

# Para el web worker
pnpm --filter @vinext-boilerplate/web exec wrangler secret put SOME_SECRET
```

## Bindings (D1, KV, R2)

Cuando migres de in-memory stores a almacenamiento real, agrega bindings en el `wrangler.jsonc` del API:

```jsonc
// packages/api/wrangler.jsonc
{
  "d1_databases": [
    { "binding": "DB", "database_name": "vinext-db", "database_id": "xxx" }
  ],
  "kv_namespaces": [
    { "binding": "CACHE", "id": "xxx" }
  ]
}
```

Luego actualiza el Context de tRPC para inyectar los bindings:

```typescript
// packages/api/src/trpc.ts
export type Context = {
  db: D1Database;
  cache: KVNamespace;
};
```

## Verificar el deploy

Después de desplegar ambos workers:

```bash
# Health check del API
curl https://vinext-boilerplate-api.<tu-subdomain>.workers.dev/

# Respuesta esperada:
# {"name":"vinext-boilerplate-api","status":"ok","timestamp":"..."}

# Test tRPC endpoint
curl https://vinext-boilerplate-api.<tu-subdomain>.workers.dev/trpc/users.list

# Abrir el frontend
open https://vinext-boilerplate.<tu-subdomain>.workers.dev/
```

## Troubleshooting

### "Error: Worker exceeded size limit"
El bundle del worker no puede superar 10MB (3MB en plan free). Revisa imports innecesarios.

### "CORS error" en el frontend
Verifica que el origin del frontend está en la lista de `cors()` en el API.

### "Failed to fetch" en tRPC
Verifica que `VITE_API_URL` apunta a la URL correcta del API worker.

### Build falla en el web
Asegúrate de que `@cloudflare/vite-plugin` solo se carga en `command === "build"` (ya está así en `vite.config.ts`).
