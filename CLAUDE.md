# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

Requer Node >= 20 e pnpm >= 9 (pinned via `packageManager: pnpm@9.7.0`).

Raiz do monorepo:

```bash
pnpm install              # bootstrap todo workspace
pnpm dev                  # server + app em paralelo
pnpm dev:server           # só a API (porta 3333 por padrão)
pnpm dev:app              # só o Next.js (porta 3000)
pnpm build                # `pnpm -r build` — compila todos os pacotes
pnpm lint                 # `pnpm -r lint`
pnpm typecheck            # `pnpm -r typecheck`
pnpm db:generate          # `prisma generate` (gera client Prisma)
pnpm db:push              # `prisma db push` (sincroniza schema com o banco)
pnpm db:studio            # abre Prisma Studio
pnpm generate:api         # gera client HTTP tipado para o front-end
```

Executar comando em um pacote específico:

```bash
pnpm --filter @salon/server <script>
pnpm --filter @salon/app <script>
```

Server (`packages/server/`):
- `pnpm dev` → `tsx watch src/server.ts`
- `pnpm build` → `tsc` para `dist/`
- `pnpm start` → `node dist/server.js` (usa build)

App (`packages/app/`):
- `pnpm dev` → `next dev`
- `pnpm lint` → `next lint`

Nenhum runner de testes está configurado — não invente `pnpm test`.

## Arquitetura

Monorepo pnpm com workspaces em `packages/*` (declarado em `pnpm-workspace.yaml`): `packages/server` (`@salon/server`), `packages/app` (`@salon/app`), `packages/shared-types`.

### Server (`packages/server/src/`)

API **Fastify 5** + TypeScript (ESM) com validação via **Zod** e banco via **Prisma 7 + adapter-pg**.

- `server.ts` → bootstrap; `app.ts` → instância Fastify com plugins registrados.
- `config/env.ts` — validação de env vars via helpers `required()` / `optional()`. **Única chave obrigatória em runtime**: `DATABASE_URL`. Demais (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PUBLIC_API_KEY`, `FRONTEND_URL`) são opcionais.
- `db/` — `prisma/client.ts` (singleton Prisma com `@prisma/adapter-pg`); `supabase.client.ts` (cliente Supabase para auth de sessão).
- `shared/infrastructure/plugins/` — plugins Fastify registrados em `app.ts`:
  - `auth.plugin.ts` — valida Bearer token via Supabase, decora `request` com `user` e `organizationId`.
  - `error-handler.plugin.ts` — mapeia `DomainError` → HTTP status, `ZodError` → 422, erros genéricos → 500.
  - `swagger.plugin.ts` — OpenAPI 3.0; docs disponíveis em `/docs`.
- `shared/domain/` — base de domínio:
  - `entity.ts` — classe `Entity` abstrata com UUID, timestamps e igualdade por identidade.
  - `value-objects/` — `EmailVO`, `PhoneVO`, `MoneyVO` com validação encapsulada.
  - `errors/` — hierarquia: `DomainError` → `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, `NotFoundError`.
- `shared/infrastructure/helpers/` — `map-fields.ts` (DB→API mapping), `pagination.ts` (cursor-based, limite máximo aplicado).
- `modules/<domínio>/` — padrão `*.controller.ts` + `*.routes.ts` + `*.service.ts`. Domínios: `auth`, `organizations`, `salons`, `professionals`, `clients`, `appointments`, `services`, `transactions`, `alerts`, `billing`. **Todos os arquivos de módulo são scaffolds vazios (0 bytes).** Ao implementar um domínio, siga o padrão e registre as rotas em `app.ts` (há um `TODO` explícito marcando o local).
- `middlewares/` — `auth.middleware.ts`, `api-key.middleware.ts`, `subscription-guard.middleware.ts`. **Todos vazios.** Usar os plugins Fastify acima até que sejam implementados.
- `public-api/` — controladores para endpoints externos (`appointments`, `availability`) consumidos pelo **n8n**. Proteger com `api-key.middleware` (via `PUBLIC_API_KEY`) quando implementado.
- `webhooks/` — `stripe.webhook.ts`, `payment.webhook.ts`. Todos vazios. Para Stripe, o handler precisa do body **raw**; no Fastify, configurar `config: { rawBody: true }` na rota ou usar `addContentTypeParser`.
- `jobs/generate-alerts.job.ts` — job batch para o motor de alertas (vazio).
- `analytics/` — `revenue.ts`, `occupancy.ts`, `avgServiceTime.ts` — funções puras de agregação (todas vazias).

Schema do banco em `prisma/schema.prisma` — 14 modelos: `User`, `Session`, `Account`, `Verification`, `Organization`, `Salon`, `Professional`, `Client`, `Service`, `Appointment`, `Transaction`, `Alert`.

### App (`packages/app/`)

Next.js 14 App Router + Tailwind CSS.

- Rotas agrupadas por contexto: `app/(auth)/`, `app/(dashboard)/`, `app/(onboarding)/`. Cada grupo tem seu próprio `layout.tsx`.
- `middleware.ts` — **não existe ainda**. Criar para proteger o grupo `(dashboard)` com redirect para `/login` quando sem sessão.
- `lib/api-client.ts` — wrapper `fetch` que aponta para `NEXT_PUBLIC_API_URL` (default `http://localhost:3333`). Toda chamada ao back passa por `apiClient.{get,post,put,delete}`.
- `lib/auth/session.ts` — resolução de sessão do usuário (Supabase). Ainda em construção.
- `components/` — organizado por feature de domínio (`agenda`, `clientes`, `financeiro`, `profissionais`, etc.), mais `ui/` (primitivos) e `shared/`.
- `hooks/` — `useRealtimeAppointments`, `useSalonSelector`, `useSubscriptionStatus`.

### `packages/shared-types`

Tipos TS compartilhados entre server e app (`Appointment`, `AppointmentStatus`, `Organization`, `SubscriptionStatus`). Sem build step: exporta direto de `index.ts`. Ao adicionar entidade, mantenha o espelho aqui para evitar drift entre os dois lados.

### Variáveis de ambiente

- `packages/server/.env` — `DATABASE_URL` é a única obrigatória. Ver `packages/server/.env.example` para referência completa.
- `packages/app/.env.local` — apenas `NEXT_PUBLIC_*` (ex.: `NEXT_PUBLIC_API_URL`).
