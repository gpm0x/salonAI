# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

Requer Node >= 20.19.2 e pnpm 9 (pinned via `packageManager: pnpm@9.7.0`).

Raiz do monorepo:

```bash
pnpm install              # bootstrap todo workspace
pnpm dev                  # api + web em paralelo
pnpm dev:api              # só a API (porta 3333)
pnpm dev:web              # só o Next.js (porta 3000)
pnpm build                # `pnpm -r build`
pnpm lint                 # `pnpm -r lint`
pnpm typecheck            # `pnpm -r typecheck`
pnpm db:generate          # prisma generate
pnpm db:push              # prisma db push
pnpm db:studio            # Prisma Studio
pnpm generate:api         # orval → client tipado a partir do OpenAPI
```

Comando num pacote específico: `pnpm --filter @salon/api <script>` /
`pnpm --filter @salon/web <script>`.

`pnpm db:generate` é obrigatório antes do primeiro `typecheck`/`build` da API —
sem o Prisma Client gerado, todo repositório em `infra/prisma/` falha com
`Module '@prisma/client' has no exported member 'PrismaClient'`. O
`prisma.config.ts` resolve `DATABASE_URL` de forma eager, então `apps/api/.env`
precisa existir mesmo só para gerar.

Nenhum runner de testes está configurado — não invente `pnpm test`. Existe um
arquivo de teste (`appointments/__tests__/bola-cross-tenant.test.ts`) mas ele
está fora do `tsconfig` e sem runner.

## Arquitetura

Monorepo pnpm; workspaces em `apps/*` e `packages/*` (`pnpm-workspace.yaml`):

- `apps/api` — `@salon/api`, Fastify 5 + TypeScript (ESM), Zod, Prisma 7 + adapter-pg.
- `apps/web` — `@salon/web`, Next.js 15 App Router + Tailwind + React Query.
- `packages/shared-types` — `@salon/shared-types`, tipos espelhados; sem build step.

### Fluxo de autenticação (a parte não óbvia)

Auth **não** roda na API. Roda no Next, via Better Auth montado em
`apps/web/app/api/auth/[...all]/route.ts`, gravando na tabela `session` do
Postgres. A API valida o Bearer token lendo essa mesma tabela
(`shared/infrastructure/plugins/auth.plugin.ts`) e daí resolve a
`organizationId` do usuário.

Consequência prática: **`DATABASE_URL` tem que ser idêntica** em
`apps/api/.env` e `apps/web/.env.local`. Bancos diferentes = login funciona e
toda chamada à API responde 401.

`authenticate` exige organização; `authenticateUser` valida só a sessão — use
esse nas rotas onde o usuário ainda não tem org (ex.: `POST /api/organizations`,
chamado no fim do cadastro).

### API (`apps/api/src/`)

- `server.ts` → bootstrap; `app.ts` → instância Fastify, plugins e prefixos de rota.
- `config/env.ts` — helpers `required()` / `optional()`. **Única obrigatória em
  runtime: `DATABASE_URL`.**
- `shared/infrastructure/plugins/` — `auth.plugin.ts`, `error-handler.plugin.ts`
  (`DomainError` → status, `ZodError` → 422, resto → 500), `swagger.plugin.ts`
  (`/docs`, só fora de produção).
- `shared/domain/` — `Entity`, value objects (`EmailVO`, `PhoneVO`, `MoneyVO`),
  hierarquia de erros a partir de `DomainError`.
- `modules/<domínio>/` — arquitetura em camadas:
  `domain/` (entity + interface de repositório) → `application/` (dtos +
  use-cases) → `infra/prisma/` (implementação) → `presentation/`
  (controller + routes). Domínios implementados: `organizations`, `salons`,
  `services`, `professionals`, `clients`, `appointments`, `transactions`,
  `dashboard`, `alerts`.
- Ainda scaffolds vazios: `modules/auth/*`, `modules/billing/*`,
  `middlewares/*`, `public-api/*`, `webhooks/payment.webhook.ts`,
  `jobs/`, `analytics/`.
- Listagens respondem sempre envelopadas: `{ data: T[] }`.

Schema em `prisma/schema.prisma` — 14 modelos, incluindo as 4 tabelas do Better
Auth (`User`, `Session`, `Account`, `Verification`).

### Web (`apps/web/`)

- Rotas por grupo: `app/(auth)/`, `app/(dashboard)/`, `app/(onboarding)/`.
- **Proteção em duas camadas**: `middleware.ts` faz checagem rasa de cookie
  (rápida, contornável); `app/(dashboard)/layout.tsx` chama `getSession()` no
  servidor e é a decisão autoritativa. Ao criar rota pública nova, adicione em
  `PUBLIC_PATHS` no middleware.
- `lib/api/` — camada de acesso à API:
  - `types.ts` espelha os DTOs; `endpoints.ts` tem caminhos + chaves do React Query.
  - `server.ts` (Server Components; devolve `null` em falha, marcado `server-only`).
  - `hooks.ts` (Client Components; React Query, com invalidação por `qk.*`).
  - `index.ts` **não** reexporta `server.ts` de propósito — `server-only`
    quebraria qualquer Client Component que importasse do índice.
- `lib/api-client.ts` (fetch + Bearer, cliente), `lib/api-server.ts` (idem,
  servidor), `lib/api-instance.ts` (mutator do orval).
- `components/` por feature, com subpastas quando a feature cresce
  (`clientes/visualizacao/`, `clientes/formularios/`), mais `ui/` e `shared/`.
- Tema claro/escuro em `components/shared/TemaProvider.tsx` + `lib/utils/tema.ts`
  (`SCRIPT_ANTI_FLASH` roda antes da primeira pintura, no `<head>`).

### Dados mockados vs. reais

`lib/mock-data.ts` é um retrato congelado em torno de 18/07/2026 usado para
desenhar as telas. A migração para a API está em curso: **`/clientes` já lê e
escreve na API** (`ClientesView.tsx` é a referência de como migrar); as demais
telas ainda importam de `@/lib/mock-data`.

Ao migrar uma tela, cheque antes se o DTO cobre os campos que a UI usa — vários
componentes do dashboard dependem de dados que a API ainda não expõe
(`slotsTotais`, comparativo com ontem), e `metas`, `whatsapp` e planos de
assinatura não têm endpoint algum.

### Variáveis de ambiente

- `apps/api/.env` — `DATABASE_URL` obrigatória. Ver `.env.example`.
- `apps/web/.env.local` — `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, mais
  `DATABASE_URL` e `BETTER_AUTH_SECRET` (Better Auth roda server-side aqui).
