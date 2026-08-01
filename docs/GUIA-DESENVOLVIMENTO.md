# SalonAI — Guia de Desenvolvimento (Backend)

## Setup Inicial

### 1. Clonar e instalar
```bash
git clone <repo-url>
cd salonAI
pnpm install
```

### 2. Configurar banco de dados
```bash
# Copiar e preencher com URL real do Supabase
cp packages/server/.env.example packages/server/.env
```

Editar `packages/server/.env`:
```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@db.SEU_PROJETO.supabase.co:5432/postgres
```

### 3. Criar tabelas no banco
```bash
pnpm db:push
```

### 4. Rodar o servidor
```bash
pnpm dev:server    # backend na :3333
pnpm dev:app       # frontend na :3000
pnpm dev           # ambos em paralelo
```

### 5. Verificar
- http://localhost:3333/health → `{"status":"ok"}`
- http://localhost:3333/docs → Swagger UI (documentacao interativa da API)

---

## Comandos Uteis

| Comando | O que faz |
|---------|-----------|
| `pnpm dev:server` | Roda backend (Fastify :3333) |
| `pnpm dev:app` | Roda frontend (Next.js :3000) |
| `pnpm dev` | Roda ambos em paralelo |
| `pnpm db:generate` | Regenera Prisma client apos mudar schema |
| `pnpm db:push` | Aplica schema no banco (cria/atualiza tabelas) |
| `pnpm db:studio` | Abre Prisma Studio (visualizar dados no browser) |
| `pnpm generate:api` | Gera hooks React Query pro frontend (Orval) |
| `pnpm build` | Build de todos os packages |
| `pnpm typecheck` | Verifica tipos TypeScript |

---

## Estrutura do Projeto

```
salonAI/
├── packages/
│   ├── app/              → Frontend (Next.js 14 + React 18 + Tailwind)
│   ├── server/           → Backend (Fastify + Prisma 7 + Zod)
│   └── shared-types/     → Types compartilhados entre front e back
├── package.json          → Scripts globais do monorepo
└── pnpm-workspace.yaml   → Config do pnpm workspaces
```

### Backend (`packages/server/`)

```
packages/server/
├── prisma/
│   └── schema.prisma         → Schema do banco (13 models)
├── prisma.config.ts          → Config Prisma 7 (conexao DB)
├── src/
│   ├── server.ts             → Bootstrap (inicia o servidor)
│   ├── app.ts                → Factory Fastify (plugins, CORS, Swagger)
│   ├── config/
│   │   └── env.ts            → Variaveis de ambiente
│   ├── modules/              → MODULOS DE NEGOCIO (onde voce vai trabalhar)
│   │   ├── salons/           → Unidades/saloes
│   │   ├── services/         → Servicos oferecidos
│   │   ├── professionals/    → Profissionais
│   │   ├── clients/          → Clientes
│   │   ├── appointments/     → Agendamentos
│   │   ├── transactions/     → Financeiro
│   │   ├── organizations/    → Organizacoes
│   │   ├── dashboard/        → Metricas/KPIs
│   │   └── alerts/           → Alertas de IA
│   └── shared/               → Codigo compartilhado (JA PRONTO)
│       ├── domain/
│       │   ├── entity.ts             → Classe base Entity
│       │   ├── errors/               → DomainErrors (NotFound, Conflict, etc)
│       │   └── value-objects/        → Email, Phone, Money
│       ├── application/
│       │   └── use-case.ts           → Interface UseCase<Input, Output>
│       └── infrastructure/
│           ├── prisma/client.ts      → Prisma singleton
│           ├── plugins/              → Auth, ErrorHandler, Swagger
│           └── helpers/              → Pagination, mapFields
```

---

## Como Criar um Modulo (Passo a Passo)

Cada modulo segue a arquitetura DDD. Vamos usar **Salons** como exemplo.

### Passo 1: Criar a Entity (domain)

```
modules/salons/domain/entities/salon.entity.ts
```

```typescript
import { Entity } from "@/shared/domain/entity"

interface SalonProps {
  organizationId: string
  name: string
  address: string | null
  city: string | null
  phone: string | null
  businessHours: string | null
  totalChairs: number
  isActive: boolean
  isMain: boolean
}

export class SalonEntity extends Entity<SalonProps> {
  get organizationId() { return this.props.organizationId }
  get name() { return this.props.name }
  get address() { return this.props.address }
  get city() { return this.props.city }
  get phone() { return this.props.phone }
  get businessHours() { return this.props.businessHours }
  get totalChairs() { return this.props.totalChairs }
  get isActive() { return this.props.isActive }
  get isMain() { return this.props.isMain }
}
```

### Passo 2: Criar o Port (domain)

```
modules/salons/domain/ports/salon.repository.ts
```

```typescript
import type { SalonEntity } from "../entities/salon.entity"
import type { PaginatedResult, PaginationParams } from "@/shared/infrastructure/helpers/pagination"

export interface SalonRepository {
  create(salon: SalonEntity): Promise<SalonEntity>
  findById(id: string, organizationId: string): Promise<SalonEntity | null>
  findAll(organizationId: string, params: PaginationParams): Promise<PaginatedResult<SalonEntity>>
  update(salon: SalonEntity): Promise<SalonEntity>
  delete(id: string, organizationId: string): Promise<void>
}
```

### Passo 3: Criar o Prisma Adapter (infrastructure)

```
modules/salons/infrastructure/prisma-salon.repository.ts
```

```typescript
import { prisma } from "@/shared/infrastructure/prisma/client"
import type { SalonRepository } from "../domain/ports/salon.repository"
import type { SalonEntity } from "../domain/entities/salon.entity"
import type { PaginatedResult, PaginationParams } from "@/shared/infrastructure/helpers/pagination"

export class PrismaSalonRepository implements SalonRepository {
  async create(salon: SalonEntity): Promise<SalonEntity> {
    const data = await prisma.salon.create({
      data: {
        id: salon.id,
        organizationId: salon.organizationId,
        name: salon.name,
        address: salon.address,
        city: salon.city,
        phone: salon.phone,
        businessHours: salon.businessHours,
        totalChairs: salon.totalChairs,
        isActive: salon.isActive,
        isMain: salon.isMain,
      },
    })
    // mapear de volta pra entity...
    return salon
  }

  async findById(id: string, organizationId: string): Promise<SalonEntity | null> {
    const data = await prisma.salon.findFirst({
      where: { id, organizationId },
    })
    if (!data) return null
    // mapear pra entity...
    return new SalonEntity({ /* props */ }, data.id)
  }

  async findAll(organizationId: string, params: PaginationParams): Promise<PaginatedResult<SalonEntity>> {
    const [data, total] = await Promise.all([
      prisma.salon.findMany({
        where: { organizationId },
        take: params.limit,
        ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
        orderBy: { createdAt: "desc" },
      }),
      prisma.salon.count({ where: { organizationId } }),
    ])

    return {
      data: data.map(d => new SalonEntity({ /* props */ }, d.id)),
      nextCursor: data.length === params.limit ? data[data.length - 1]?.id ?? null : null,
      total,
    }
  }

  async update(salon: SalonEntity): Promise<SalonEntity> {
    await prisma.salon.update({
      where: { id: salon.id },
      data: { name: salon.name /* ... */ },
    })
    return salon
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await prisma.salon.deleteMany({ where: { id, organizationId } })
  }
}
```

### Passo 4: Criar os Use Cases (application)

```
modules/salons/application/use-cases/create-salon.ts
```

```typescript
import type { UseCase } from "@/shared/application/use-case"
import type { SalonRepository } from "../../domain/ports/salon.repository"
import { SalonEntity } from "../../domain/entities/salon.entity"
import { ConflictError } from "@/shared/domain/errors"

interface CreateSalonInput {
  organizationId: string
  name: string
  address?: string
  city?: string
  phone?: string
  totalChairs?: number
}

interface CreateSalonOutput {
  id: string
  name: string
}

export class CreateSalon implements UseCase<CreateSalonInput, CreateSalonOutput> {
  constructor(private readonly salonRepo: SalonRepository) {}

  async execute(input: CreateSalonInput): Promise<CreateSalonOutput> {
    const salon = new SalonEntity({
      organizationId: input.organizationId,
      name: input.name,
      address: input.address ?? null,
      city: input.city ?? null,
      phone: input.phone ?? null,
      businessHours: null,
      totalChairs: input.totalChairs ?? 1,
      isActive: true,
      isMain: false,
    })

    const created = await this.salonRepo.create(salon)

    return { id: created.id, name: created.name }
  }
}
```

### Passo 5: Criar as Routes (presentation)

```
modules/salons/presentation/salon.routes.ts
```

```typescript
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { PrismaSalonRepository } from "../infrastructure/prisma-salon.repository"
import { CreateSalon } from "../application/use-cases/create-salon"

// Schemas Zod (geram Swagger automaticamente!)
const createSalonSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  totalChairs: z.number().int().positive().optional(),
})

const salonResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  phone: z.string().nullable(),
  totalChairs: z.number(),
  isActive: z.boolean(),
  isMain: z.boolean(),
  createdAt: z.string(),
})

export async function salonRoutes(app: FastifyInstance) {
  const repo = new PrismaSalonRepository()

  // POST /api/salons
  app.withTypeProvider<ZodTypeProvider>().post("/", {
    schema: {
      tags: ["Salons"],
      summary: "Criar novo salao/unidade",
      body: createSalonSchema,
      response: { 201: salonResponseSchema },
    },
    handler: async (request, reply) => {
      const useCase = new CreateSalon(repo)
      const result = await useCase.execute({
        organizationId: request.organizationId,
        ...request.body,
      })
      return reply.status(201).send(result)
    },
  })

  // GET /api/salons
  app.withTypeProvider<ZodTypeProvider>().get("/", {
    schema: {
      tags: ["Salons"],
      summary: "Listar saloes da organizacao",
      querystring: z.object({
        cursor: z.string().optional(),
        limit: z.string().optional(),
      }),
      response: {
        200: z.object({
          data: z.array(salonResponseSchema),
          nextCursor: z.string().nullable(),
          total: z.number(),
        }),
      },
    },
    handler: async (request, reply) => {
      // implementar...
    },
  })

  // GET /api/salons/:id
  // PUT /api/salons/:id
  // DELETE /api/salons/:id
}
```

### Passo 6: Registrar no app.ts

```typescript
// Em src/app.ts, adicionar:
import { salonRoutes } from "./modules/salons/presentation/salon.routes"

// Dentro de buildApp():
await app.register(salonRoutes, { prefix: "/api/salons" })
```

### Passo 7: Gerar hooks pro frontend

```bash
# Com o server rodando:
pnpm generate:api
```

Isso gera automaticamente hooks React Query em `packages/app/src/generated/api/` que o frontend usa direto.

---

## Fluxo do Orval (API → Hooks automaticos)

```
Voce define schema Zod na rota
        ↓
Fastify + Swagger gera OpenAPI spec (/docs/json)
        ↓
Orval le o spec e gera hooks TypeScript
        ↓
Frontend importa hooks prontos com tipos
```

**Exemplo:** Voce cria `POST /api/salons` com schema Zod → Orval gera `useCreateSalon()` hook → Frontend usa:

```tsx
import { useCreateSalon } from "@/generated/api/salons"

function CriarSalao() {
  const { mutate } = useCreateSalon()
  // mutate({ name: "Salao X", city: "SP" }) → tipado automaticamente!
}
```

---

## Ordem de Implementacao (Fases)

### FASE 1: Auth (validacao de token)
Better Auth roda no Next.js (frontend). Backend so valida o token.
- **O que existe:** `auth.plugin.ts` ja valida Bearer token via tabela `session`
- **O que falta:** Testar com Better Auth real, criar Organization entity/adapter

### FASE 2: CRUD Core — 6 modulos (ordem de dependencia FK)

| # | Modulo | Prefix | Deps |
|---|--------|--------|------|
| 1 | **Salons** (unidades) | `/api/salons` | nenhuma |
| 2 | **Services** (servicos) | `/api/services` | nenhuma |
| 3 | **Professionals** (profissionais) | `/api/professionals` | salons |
| 4 | **Clients** (clientes) | `/api/clients` | professionals |
| 5 | **Appointments** (agendamentos) | `/api/appointments` | todos acima |
| 6 | **Transactions** (financeiro) | `/api/transactions` | appointments |

**Cada modulo tem os mesmos endpoints:**

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `POST` | `/api/{modulo}` | Criar |
| `GET` | `/api/{modulo}` | Listar (paginado, cursor) |
| `GET` | `/api/{modulo}/:id` | Buscar por ID |
| `PUT` | `/api/{modulo}/:id` | Atualizar |
| `DELETE` | `/api/{modulo}/:id` | Deletar |

### FASE 3: Dashboard & Analytics
- `GET /api/dashboard/metrics` — KPIs (agendamentos, faturamento, ocupacao, tempo medio)
- `GET /api/dashboard/insights` — Alertas/insights
- Prisma aggregate queries (count, sum, avg)

### FASE 4: Alerts Engine (IA simples)
- Regras sem LLM: profissional >90% ocupacao, cliente sem visita >45d, servico queda >20%
- `GET /api/alerts` — Listar alertas
- `POST /api/alerts/generate` — Gerar alertas baseado em regras

### FASE 5: Integracao Frontend
- Trocar `mock-data.ts` por chamadas reais via hooks gerados pelo Orval
- Auth context com Better Auth
- Interceptor de Authorization no api-instance

---

## Models do Banco (Prisma)

Todos ja existem no schema. Resumo:

| Model | Tabela | Campos chave |
|-------|--------|--------------|
| User | `user` | id, name, email (Better Auth) |
| Session | `session` | token, userId, expiresAt (Better Auth) |
| Organization | `organization` | name, ownerId, subscriptionStatus, slug |
| Salon | `salon` | organizationId, name, address, totalChairs |
| Professional | `professional` | organizationId, salonId, name, specialty, commissionPct |
| Client | `client` | organizationId, name, email, phone, status |
| Service | `service` | organizationId, name, category, durationMin, priceCents |
| Appointment | `appointment` | organizationId, salonId, professionalId, clientId, serviceId, startsAt, status |
| Transaction | `transaction` | organizationId, appointmentId, amountCents, paymentMethod |
| Alert | `alert` | organizationId, area, tone, title, description, confidence |

**Multi-tenant:** TODO model de negocio tem `organizationId`. Filtrar SEMPRE por `organizationId` nas queries.

---

## Padroes Importantes

### Toda rota precisa de schema Zod
Nao crie rota sem schema. O Swagger e o Orval dependem disso.

### Toda query filtra por organizationId
```typescript
// CERTO
prisma.salon.findMany({ where: { organizationId } })

// ERRADO — vazamento de dados entre organizacoes!
prisma.salon.findMany()
```

### Use os DomainErrors
```typescript
import { NotFoundError, ConflictError } from "@/shared/domain/errors"

// No use case:
const salon = await repo.findById(id, organizationId)
if (!salon) throw new NotFoundError("Salao nao encontrado")
```

### Paginacao com cursor
```typescript
import { parsePagination } from "@/shared/infrastructure/helpers/pagination"

// Na rota:
const params = parsePagination(request.query)
const result = await repo.findAll(orgId, params)
```

### Precos em centavos
```typescript
// Banco armazena em centavos (int)
// priceCents: 5000 = R$ 50,00
// Converter na resposta se necessario
import { centsToReais } from "@/shared/infrastructure/helpers/map-fields"
```

---

## Git Workflow

```bash
# Criar branch
git checkout -b feat/salons-crud

# Implementar, testar
pnpm dev:server

# Commitar por feature
git add .
git commit -m "feat: add salons CRUD module"

# Push e PR
git push -u origin feat/salons-crud
# Criar PR no GitHub
```

**Regras:**
- 1 commit por feature/modulo
- Conventional commits: `feat:`, `fix:`, `refactor:`
- Nunca push direto na main — sempre PR
- Nunca commitar `.env`

---

## Troubleshooting

| Problema | Solucao |
|----------|---------|
| `prisma generate` falha | Verificar se `.env` tem `DATABASE_URL` valido |
| Server nao sobe | `pnpm install` + `pnpm db:generate` |
| Tipos do Prisma nao reconhecidos | `pnpm db:generate` (regenera client) |
| Orval falha | Server precisa estar rodando (`pnpm dev:server`) |
| Mudou schema.prisma | `pnpm db:generate` + `pnpm db:push` |
