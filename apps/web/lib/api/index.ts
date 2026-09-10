/**
 * Camada de acesso à API (`apps/api`).
 *
 *   Server Component  →  import { api } from "@/lib/api/server"
 *   Client Component  →  import { useClientes } from "@/lib/api/hooks"
 *
 * `server.ts` não é reexportado aqui de propósito: ele carrega `server-only`,
 * e um reexport faria qualquer Client Component que importasse deste índice
 * quebrar o build.
 */

export * from "./types";
export { endpoints, qk } from "./endpoints";
