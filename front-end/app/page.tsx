import { redirect } from "next/navigation";

export default function Home() {
  // Sem sessão implementada ainda: cai direto no painel.
  // Quando a auth existir, redirecionar para "/login" quando não autenticado.
  redirect("/dashboard");
}
