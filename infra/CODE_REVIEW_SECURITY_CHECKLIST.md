# Security Code Review Checklist

Apply to every PR that touches controllers, use cases, or repositories.

## SEC-03: Tenant Isolation (BOLA / IDOR)

- [ ] `organizationId` comes **only** from `request.organizationId` (set by `auth.plugin.ts`) — never from body, query, or URL params
- [ ] Every `findById` / `findMany` passes `organizationId` as a required WHERE condition
- [ ] Every `update` / `delete` at the repository layer includes `organizationId` in the WHERE clause (use `updateMany`/`deleteMany` when Prisma's `update` only accepts unique fields)
- [ ] New endpoints have a corresponding BOLA cross-tenant test in `__tests__/bola-cross-tenant.test.ts`

## SEC-02: Header Stripping

- [ ] No new middleware reads or trusts `x-middleware-subrequest`
- [ ] Protected layouts call `getSession()` (server-side) rather than relying solely on middleware cookie check

## SEC-05: Input Validation & Raw Queries

- [ ] Every new write DTO uses `.strict()` — `pnpm lint` will fail the PR if omitted (`no-restricted-properties` rule catches `$queryRawUnsafe`/`$executeRawUnsafe`)
- [ ] Raw SQL (`$queryRaw`) uses `Prisma.sql\`...\`` tagged template — never string concatenation
- [ ] Dynamic filters (search, sort) use an allow-list of column names, never user string directly in `orderBy`/`where`

## General

- [ ] No secrets, tokens, or internal IDs logged
- [ ] Rate limiting applies to any new public or auth endpoint
