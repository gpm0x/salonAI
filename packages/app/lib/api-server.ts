import { getSession } from "@/lib/auth/session";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const session = await getSession();
    const token = session?.session?.token;

    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}
