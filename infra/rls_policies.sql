-- SEC-04: Row Level Security policies — SalonAI
--
-- ARCHITECTURE NOTE:
-- The Fastify server connects as the postgres superuser (via Supabase pooler).
-- PostgreSQL superusers bypass RLS unconditionally, so these policies do NOT
-- affect the application's Prisma queries — tenant isolation there is enforced
-- at the application layer (SEC-03).
--
-- What these policies DO protect:
--   1. Anon key exposure: blocks read/write via SUPABASE_ANON_KEY
--   2. Direct Supabase client SDK access from the browser (if anon key leaks)
--   3. "authenticated" role (Supabase Auth JWT) — not used by this app today,
--      but blocked here to prevent accidental access if Supabase Auth is added
--      without corresponding RLS updates.
--
-- HOW TO APPLY:
--   Supabase Dashboard → SQL Editor → paste and run.
--   Or: supabase db execute --file infra/rls_policies.sql
--
-- Run AFTER enabling RLS on each table (already done via Dashboard).
-- Re-run is idempotent: DROP POLICY IF EXISTS before CREATE.

-- ============================================================
-- Helper: macro for "deny anon and authenticated"
-- Applied to: organization, salon, professional, client,
--             service, appointment, transaction, alert
-- ============================================================

-- organization
DROP POLICY IF EXISTS "deny_anon_organization"          ON "organization";
DROP POLICY IF EXISTS "deny_authenticated_organization" ON "organization";
CREATE POLICY "deny_anon_organization"
  ON "organization" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_organization"
  ON "organization" FOR ALL TO authenticated USING (false);

-- salon
DROP POLICY IF EXISTS "deny_anon_salon"          ON "salon";
DROP POLICY IF EXISTS "deny_authenticated_salon" ON "salon";
CREATE POLICY "deny_anon_salon"
  ON "salon" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_salon"
  ON "salon" FOR ALL TO authenticated USING (false);

-- professional
DROP POLICY IF EXISTS "deny_anon_professional"          ON "professional";
DROP POLICY IF EXISTS "deny_authenticated_professional" ON "professional";
CREATE POLICY "deny_anon_professional"
  ON "professional" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_professional"
  ON "professional" FOR ALL TO authenticated USING (false);

-- client
DROP POLICY IF EXISTS "deny_anon_client"          ON "client";
DROP POLICY IF EXISTS "deny_authenticated_client" ON "client";
CREATE POLICY "deny_anon_client"
  ON "client" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_client"
  ON "client" FOR ALL TO authenticated USING (false);

-- service
DROP POLICY IF EXISTS "deny_anon_service"          ON "service";
DROP POLICY IF EXISTS "deny_authenticated_service" ON "service";
CREATE POLICY "deny_anon_service"
  ON "service" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_service"
  ON "service" FOR ALL TO authenticated USING (false);

-- appointment
DROP POLICY IF EXISTS "deny_anon_appointment"          ON "appointment";
DROP POLICY IF EXISTS "deny_authenticated_appointment" ON "appointment";
CREATE POLICY "deny_anon_appointment"
  ON "appointment" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_appointment"
  ON "appointment" FOR ALL TO authenticated USING (false);

-- transaction
DROP POLICY IF EXISTS "deny_anon_transaction"          ON "transaction";
DROP POLICY IF EXISTS "deny_authenticated_transaction" ON "transaction";
CREATE POLICY "deny_anon_transaction"
  ON "transaction" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_transaction"
  ON "transaction" FOR ALL TO authenticated USING (false);

-- alert
DROP POLICY IF EXISTS "deny_anon_alert"          ON "alert";
DROP POLICY IF EXISTS "deny_authenticated_alert" ON "alert";
CREATE POLICY "deny_anon_alert"
  ON "alert" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_alert"
  ON "alert" FOR ALL TO authenticated USING (false);

-- ============================================================
-- Auth tables (Better Auth — user, session, account, verification)
-- More sensitive: block everything for non-superuser roles.
-- ============================================================

DROP POLICY IF EXISTS "deny_anon_user"          ON "user";
DROP POLICY IF EXISTS "deny_authenticated_user" ON "user";
CREATE POLICY "deny_anon_user"
  ON "user" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_user"
  ON "user" FOR ALL TO authenticated USING (false);

DROP POLICY IF EXISTS "deny_anon_session"          ON "session";
DROP POLICY IF EXISTS "deny_authenticated_session" ON "session";
CREATE POLICY "deny_anon_session"
  ON "session" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_session"
  ON "session" FOR ALL TO authenticated USING (false);

DROP POLICY IF EXISTS "deny_anon_account"          ON "account";
DROP POLICY IF EXISTS "deny_authenticated_account" ON "account";
CREATE POLICY "deny_anon_account"
  ON "account" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_account"
  ON "account" FOR ALL TO authenticated USING (false);

DROP POLICY IF EXISTS "deny_anon_verification"          ON "verification";
DROP POLICY IF EXISTS "deny_authenticated_verification" ON "verification";
CREATE POLICY "deny_anon_verification"
  ON "verification" FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_verification"
  ON "verification" FOR ALL TO authenticated USING (false);

-- ============================================================
-- Verification query — run in Supabase SQL Editor to confirm
-- ============================================================
-- SELECT tablename, policyname, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
--
-- Expected: every business table has deny_anon + deny_authenticated policies.
-- service_role and postgres roles will NOT appear — they bypass RLS by design.
