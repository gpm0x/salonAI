/**
 * `apiClient` (lib/api-client.ts) lança `Error("API {status}: {body}")`, onde
 * `body` é o JSON serializado do DomainError (`{ code, message }`). Extrai o
 * `message` legível pro usuário, com fallback quando o parsing falha.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    const match = error.message.match(/"message":"([^"]+)"/);
    if (match) return match[1];
  }
  return fallback;
}
