# salon-saas

SaaS de gestão para salões de beleza. Monorepo pnpm com dois apps deployáveis
(`apps/`) e as libs compartilhadas entre eles (`packages/`).

## Estrutura

```
salonAI/
├── apps/
│   ├── web/                 Next.js 15 (App Router) + Tailwind — @salon/web
│   └── api/                 Fastify 5 + Prisma 7 — @salon/api
├── packages/
│   └── shared-types/        tipos TS compartilhados — @salon/shared-types
├── infra/                   Caddyfile, nginx.conf
├── docs/                    guia de desenvolvimento + collection Postman
├── pnpm-workspace.yaml
└── package.json             scripts que orquestram os dois lados
```

## Como rodar

Pré-requisitos: Node.js >= 20.19.2 e pnpm 9.

```bash
pnpm install          # bootstrap do workspace inteiro

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# preencha DATABASE_URL nos dois (a MESMA string) e gere BETTER_AUTH_SECRET:
#   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

pnpm db:generate      # gera o Prisma Client (obrigatório antes do 1º build)
pnpm db:push          # cria as tabelas no banco

pnpm dev              # sobe api (:3333) e web (:3000) em paralelo
pnpm dev:api          # só a API
pnpm dev:web          # só o Next.js
```

Outros scripts: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm db:studio`,
`pnpm generate:api`.

## Como as duas pontas se conectam

```
navegador
   │
   │  ①  login / cadastro
   ▼
apps/web  ── Better Auth em app/api/auth/[...all] ──┐
   │                                                 │  grava sessão
   │  ②  Authorization: Bearer <session.token>       ▼
   │                                          ┌─────────────┐
   ├─── lib/api/server.ts  (Server Component) │  PostgreSQL │
   └─── lib/api/hooks.ts   (Client + Query)   │  (Supabase) │
             │                                 └─────────────┘
             │  ③  fetch → :3333                      ▲
             ▼                                        │  valida o token
        apps/api ── auth.plugin ─────────────────────┘   na tabela `session`
```

1. **Autenticação** roda no Next (`better-auth`), não na API. As sessões vão
   para a tabela `session` do mesmo Postgres.
2. **Cada request ao back** leva o token da sessão no header `Authorization`
   (ou no cookie `better-auth.session_token`, como fallback em dev).
3. **A API valida** esse token direto no banco (`auth.plugin.ts`) e resolve a
   `organizationId` do usuário — é o que isola os dados por tenant.

Por isso `DATABASE_URL` precisa ser **idêntica** em `apps/api/.env` e
`apps/web/.env.local`: se apontarem para bancos diferentes, o login funciona e
toda chamada à API responde 401.

### Camada de acesso à API (`apps/web/lib/api/`)

| Arquivo | Papel |
|---|---|
| `types.ts` | Espelho dos DTOs de `apps/api`. |
| `endpoints.ts` | Caminhos das rotas + chaves de cache do React Query. |
| `server.ts` | Leitura em Server Components. Devolve `null` em falha. |
| `hooks.ts` | Leitura e escrita em Client Components, via React Query. |

```tsx
// Server Component
import { api } from "@/lib/api/server";
const metricas = await api.dashboard.metricas();

// Client Component
import { useClientes, useCriarCliente } from "@/lib/api/hooks";
const { data, isLoading } = useClientes();
```

Alternativa gerada: `pnpm generate:api` roda o orval contra o OpenAPI da API
(`http://localhost:3333/docs/json`, com a API no ar) e produz um client tipado
em `apps/web/src/generated/api`.

## Proteção de rotas

Duas camadas, de propósito:

- `apps/web/middleware.ts` — checagem rasa de cookie, redireciona para `/login`.
  Rápido, mas contornável.
- `app/(dashboard)/layout.tsx` — `getSession()` no servidor, valida contra o
  banco. É esta que decide.

## Módulos da API

`organizations`, `salons`, `professionals`, `clients`, `appointments`,
`services`, `transactions`, `dashboard`, `alerts` (motor de regras) e
`billing` (Stripe).

Endpoints em `src/public-api/` são consumidos pelo **n8n** e protegidos por
API key (`PUBLIC_API_KEY`).

## Estado da migração de dados

A API já serve dados reais para todos os módulos acima. No front, as telas
foram desenhadas sobre `lib/mock-data.ts` e estão sendo migradas uma a uma:

| Tela | Fonte |
|---|---|
| `/clientes` | **API** (list + create + update + delete) |
| Demais telas | `lib/mock-data.ts` |

Para migrar uma tela, troque o import de `@/lib/mock-data` pelo hook
correspondente em `@/lib/api/hooks` — `ClientesView.tsx` serve de referência.
Note que `metas`, `whatsapp` e os planos de assinatura ainda não têm endpoint
na API.
