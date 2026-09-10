// Força da senha: 0–4
export function forcaSenha(senha: string): number {
  let s = 0;
  if (senha.length >= 8) s++;
  if (senha.length >= 12) s++;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) s++;
  if (/\d/.test(senha) && /[^A-Za-z0-9]/.test(senha)) s++;
  return s;
}

export const forcaMeta = [
  { label: "Muito fraca", cor: "bg-danger", texto: "text-danger" },
  { label: "Fraca", cor: "bg-danger", texto: "text-danger" },
  { label: "Razoável", cor: "bg-accent", texto: "text-accent" },
  { label: "Boa", cor: "bg-primary", texto: "text-primary" },
  { label: "Excelente", cor: "bg-success", texto: "text-success" },
];

/*
  O que falta para a senha subir de nível.

  Um medidor que só diz "fraca" empurra o problema de volta para quem digita.
  A dica devolve a próxima ação concreta — e some quando não há mais nenhuma,
  em vez de virar um rodapé permanente.
*/
export function dicaSenha(senha: string): string | undefined {
  if (!senha) return undefined;
  if (senha.length < 8) return "Use pelo menos 8 caracteres.";
  if (!/[A-Z]/.test(senha) || !/[a-z]/.test(senha))
    return "Misture maiúsculas e minúsculas.";
  if (!/\d/.test(senha)) return "Inclua ao menos um número.";
  if (!/[^A-Za-z0-9]/.test(senha)) return "Um símbolo (!, @, #) deixa bem mais forte.";
  if (senha.length < 12) return "Chegue a 12 caracteres para o nível máximo.";
  return undefined;
}
