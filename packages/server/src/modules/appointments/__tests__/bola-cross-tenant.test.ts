/**
 * SEC-03: BOLA / IDOR cross-tenant isolation tests
 *
 * These tests verify that no appointment operation leaks data or mutates state
 * across organization boundaries. Each test:
 *   1. Creates a resource owned by tenant A.
 *   2. Attempts the same operation authenticated as tenant B.
 *   3. Asserts 403 or 404 — never 200/204 with tenant A data.
 *
 * Runner: add vitest (or jest) to devDependencies when the test infra is set up.
 * The test logic is framework-agnostic (describe/it/expect).
 *
 * To run manually against a local server:
 *   BASE=http://localhost:3333 TOKEN_A=<jwt-a> TOKEN_B=<jwt-b> pnpm test
 */

import { describe, it, expect, beforeAll } from "vitest"

const BASE = process.env.BASE ?? "http://localhost:3333"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function req(
  method: string,
  path: string,
  token: string,
  body?: unknown,
): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  return { status: res.status, body: text ? JSON.parse(text) : null }
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("SEC-03 BOLA — appointment cross-tenant isolation", () => {
  // These must be set via environment variables pointing to real test tenants.
  // Never hardcode tokens or IDs here.
  const TOKEN_A = process.env.TOKEN_A ?? ""
  const TOKEN_B = process.env.TOKEN_B ?? ""
  let appointmentIdOwnedByA: string

  beforeAll(async () => {
    if (!TOKEN_A || !TOKEN_B) {
      throw new Error("TOKEN_A and TOKEN_B env vars must be set for BOLA tests")
    }
  })

  it("tenant A can create an appointment", async () => {
    const { status, body } = await req("POST", "/api/appointments", TOKEN_A, {
      salonId: process.env.SALON_ID_A,
      professionalId: process.env.PROFESSIONAL_ID_A,
      clientId: process.env.CLIENT_ID_A,
      serviceId: process.env.SERVICE_ID_A,
      startsAt: new Date(Date.now() + 3_600_000).toISOString(),
      endsAt: new Date(Date.now() + 5_400_000).toISOString(),
      priceCents: 5000,
    })
    expect(status).toBe(201)
    appointmentIdOwnedByA = (body as { appointmentId: string }).appointmentId
    expect(appointmentIdOwnedByA).toBeTruthy()
  })

  it("tenant B GET /api/appointments/:id owned by A returns 404", async () => {
    const { status } = await req("GET", `/api/appointments/${appointmentIdOwnedByA}`, TOKEN_B)
    expect(status).toBe(404)
  })

  it("tenant B PATCH status on appointment owned by A returns 404", async () => {
    const { status } = await req(
      "PATCH",
      `/api/appointments/${appointmentIdOwnedByA}/status`,
      TOKEN_B,
      { status: "confirmado" },
    )
    expect(status).toBe(404)
  })

  it("tenant B DELETE (cancel) appointment owned by A returns 404", async () => {
    const { status } = await req(
      "DELETE",
      `/api/appointments/${appointmentIdOwnedByA}`,
      TOKEN_B,
    )
    expect(status).toBe(404)
  })

  it("tenant A can still read its own appointment after B's attempts", async () => {
    const { status, body } = await req(
      "GET",
      `/api/appointments/${appointmentIdOwnedByA}`,
      TOKEN_A,
    )
    expect(status).toBe(200)
    // Status must not have been mutated by tenant B's PATCH attempt
    expect((body as { status: string }).status).not.toBe("confirmado")
  })
})
