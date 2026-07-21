# salon-saas

SaaS de gestão para salões de beleza. Monorepo gerenciado com **pnpm workspaces**.

## Stack

- **back-end/** — API em Node.js (Express/Fastify) + TypeScript, organizada por domínio. Banco/Auth via Supabase, cobrança via Stripe.
- **front-end/** — Next.js (App Router) + Tailwind CSS.
- **packages/shared-types/** — tipos TypeScript compartilhados entre back-end e front-end.

## Estrutura

```
salon-saas/
├── back-end/         API Node.js + TypeScript
├── front-end/        Next.js (App Router) + Tailwind
├── packages/
│   └── shared-types/ tipos compartilhados
├── pnpm-workspace.yaml
└── package.json      scripts que rodam os dois lados juntos
```

## Como rodar

Pré-requisitos: Node.js >= 20 e pnpm >= 9.

```bash
pnpm install          # instala dependências de todo o workspace
pnpm dev              # sobe back-end e front-end em paralelo
pnpm dev:back         # só a API
pnpm dev:front        # só o Next.js
```

## Variáveis de ambiente

- `back-end/.env.example` → copie para `back-end/.env`
- `front-end/.env.local` → preencha com as chaves públicas

## Módulos do back-end

`auth`, `organizations`, `salons`, `professionals`, `clients`, `appointments`,
`services`, `transactions`, `alerts` (motor de regras determinísticas) e `billing` (Stripe).

Endpoints em `public-api/` são consumidos pelo **n8n** e protegidos por API key.
