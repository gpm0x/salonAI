# salon-saas

[![CI](https://github.com/gpm0x/salonAI/actions/workflows/ci.yml/badge.svg)](https://github.com/gpm0x/salonAI/actions/workflows/ci.yml)

SaaS de gestão para salões de beleza. Monorepo pnpm com dois apps deployáveis
(`apps/`) e as libs compartilhadas entre eles (`packages/`).

## Estrutura

```
salonAI/
├── apps/
│   ├── web/                 Next.js 15 (App Router) + Tailwind (@salon/web)
│   └── api/                 Fastify 5 + Prisma 7 (@salon/api)
├── packages/
│   └── shared-types/        tipos TS compartilhados (@salon/shared-types)
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
   `organizationId` do usuário: é o que isola os dados por tenant.

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

- `apps/web/middleware.ts`: checagem rasa de cookie, redireciona para `/login`.
  Rápido, mas contornável.
- `app/(dashboard)/layout.tsx`: `getSession()` no servidor, valida contra o
  banco. É esta que decide.

## Módulos da API

`organizations`, `salons`, `professionals`, `clients`, `appointments`,
`services`, `transactions`, `dashboard`, `alerts` (motor de regras),
`onboarding` e `billing` (Stripe).

`public` expõe a página pública de agendamento (busca de salão por slug,
disponibilidade e criação de agendamento) sem autenticação, sob rate limit.

## Estado da migração de dados

A API já serve dados reais para todos os módulos acima. No front, as telas
foram desenhadas sobre `lib/mock-data.ts` e estão sendo migradas uma a uma:

| Tela | Fonte |
|---|---|
| `/clientes` | **API** (list + create + update + delete) |
| Demais telas | `lib/mock-data.ts` |

Para migrar uma tela, troque o import de `@/lib/mock-data` pelo hook
correspondente em `@/lib/api/hooks` (`ClientesView.tsx` serve de referência).
Note que `metas`, `whatsapp` e os planos de assinatura ainda não têm endpoint
na API.

## CI/CD

### CI (`.github/workflows/ci.yml`)

Roda em todo Pull Request e em push na `main`. Steps: install (`pnpm install
--frozen-lockfile`), `pnpm db:generate` (Prisma Client, obrigatório antes do
typecheck), `pnpm typecheck`, `pnpm lint` e `pnpm build`. Usa Node 22 e cache
de pnpm store via `actions/setup-node`. Todas as env vars usadas no job são
valores dummy (`DATABASE_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`,
`BETTER_AUTH_SECRET`); nenhum step conecta de fato em banco ou serviço
externo.

Aviso conhecido: `apps/web` ainda não tem `eslint.config.*` (o pacote nem tem
`eslint` como devDependency), então `pnpm lint` falha hoje nesse app com o
prompt interativo do `next lint`. Não é um problema introduzido por este CI,
mas vai quebrar o step `Lint` até alguém configurar o ESLint em `apps/web`.

### Deploy (`.github/workflows/deploy.yml`)

Dispara via `workflow_run` quando o CI termina com sucesso na `main` (garante
que nunca vai pra produção um commit que não passou pelo quality gate). Três
jobs:

1. `migrate`: gera o Prisma Client e aplica o schema com
   `prisma db push` (o projeto ainda não usa pasta de migrations). Quando
   adotar `prisma migrate`, trocar por `prisma migrate deploy`.
2. `deploy-web`: `vercel pull` → `vercel build` → `vercel deploy --prebuilt
   --prod`, rodando em `apps/web`.
3. `deploy-api-render`: a API Fastify não roda na Vercel; em produção ela
   fica no Render, que já redeploya sozinho em push na branch conectada. Este
   job só dispara um deploy hook via `curl` como gatilho explícito, e só roda
   se o secret `RENDER_DEPLOY_HOOK_URL` estiver configurado.

### Secrets necessários (GitHub → Settings → Secrets and variables → Actions)

| Secret | Usado em | Descrição |
|---|---|---|
| `DATABASE_URL` | deploy (migrate) | Postgres de produção (Supabase), mesma string usada por `apps/api` e `apps/web` |
| `VERCEL_TOKEN` | deploy (deploy-web) | Token de acesso da conta/time Vercel |
| `VERCEL_ORG_ID` | deploy (deploy-web) | ID do time/org na Vercel |
| `VERCEL_PROJECT_ID` | deploy (deploy-web) | ID do projeto Vercel ligado a `apps/web` |
| `RENDER_DEPLOY_HOOK_URL` | deploy (deploy-api-render) | URL do deploy hook do serviço da API no Render (opcional) |

### Branch protection (não aplicado, decisão do usuário)

Comando pra exigir que o job `Quality Gate` do CI passe antes de qualquer
merge na `main`. Não foi executado; documentado aqui pra rodar quando
decidido:

```bash
gh api repos/gpm0x/salonAI/branches/main/protection \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Quality Gate"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1
  },
  "restrictions": null
}
EOF
```
