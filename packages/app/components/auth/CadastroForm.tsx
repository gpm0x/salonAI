"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import {
  IconMail,
  IconUser,
  IconStore,
  IconPhone,
  IconArrowRight,
  IconCheck,
  IconScissors,
  IconSparkles,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

type Tipo = "salao" | "barbearia" | "ambos";

const tipos: { valor: Tipo; label: string }[] = [
  { valor: "salao", label: "Salão" },
  { valor: "barbearia", label: "Barbearia" },
  { valor: "ambos", label: "Ambos" },
];

const tamanhos = [
  "Sou só eu",
  "2 a 5 profissionais",
  "6 a 15 profissionais",
  "Mais de 15",
];

// Força da senha: 0–4
function forcaSenha(senha: string): number {
  let s = 0;
  if (senha.length >= 8) s++;
  if (senha.length >= 12) s++;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) s++;
  if (/\d/.test(senha) && /[^A-Za-z0-9]/.test(senha)) s++;
  return s;
}

const forcaMeta = [
  { label: "Muito fraca", cor: "bg-danger", texto: "text-danger" },
  { label: "Fraca", cor: "bg-danger", texto: "text-danger" },
  { label: "Razoável", cor: "bg-accent", texto: "text-accent" },
  { label: "Boa", cor: "bg-primary", texto: "text-primary" },
  { label: "Excelente", cor: "bg-success", texto: "text-success" },
];

export function CadastroForm() {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [concluido, setConcluido] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmar: "",
    nomeSalao: "",
    telefone: "",
    tipo: "salao" as Tipo,
    tamanho: tamanhos[1],
    aceite: false,
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: "" }));
  }

  const forca = forcaSenha(form.senha);

  function validarEtapa1() {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Informe seu nome.";
    if (!form.email.trim()) e.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido.";
    if (!form.senha) e.senha = "Crie uma senha.";
    else if (form.senha.length < 8)
      e.senha = "A senha precisa ter ao menos 8 caracteres.";
    if (form.confirmar !== form.senha)
      e.confirmar = "As senhas não coincidem.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function avancar(ev: FormEvent) {
    ev.preventDefault();
    if (validarEtapa1()) setEtapa(2);
  }

  function finalizar(ev: FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.nomeSalao.trim()) e.nomeSalao = "Informe o nome do salão.";
    if (!form.telefone.trim()) e.telefone = "Informe um telefone.";
    if (!form.aceite) e.aceite = "É preciso aceitar os termos para continuar.";
    setErros(e);
    if (Object.keys(e).length) return;

    setEnviando(true);
    // simula a criação da conta; troque pela chamada real da API
    setTimeout(() => {
      setEnviando(false);
      setConcluido(true);
    }, 1400);
  }

  // ── Sucesso ─────────────────────────────────
  if (concluido) {
    return (
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-success/12 text-success">
          <IconCheck width={30} height={30} />
        </span>
        <h1 className="mt-6 font-display text-[2rem] leading-tight text-ink">
          Salão criado!
        </h1>
        <p className="mt-2 text-sm text-muted">
          Tudo pronto, {form.nome.split(" ")[0]}. O{" "}
          <span className="font-medium text-ink">{form.nomeSalao}</span> já está
          no ar — agora é só configurar sua agenda e sua equipe.
        </p>

        <div className="mt-7 rounded-2xl border border-line bg-surface p-4 text-left">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
            <IconSparkles width={13} height={13} className="text-accent" />
            Próximos passos
          </p>
          <ul className="mt-3 space-y-2">
            {[
              "Cadastrar seus serviços e preços",
              "Adicionar os profissionais da equipe",
              "Conectar o WhatsApp do salão",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-ink/80">
                <IconCheck
                  width={15}
                  height={15}
                  className="mt-0.5 shrink-0 text-success"
                />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <Link href="/dashboard" className="mt-6 block">
          <Button size="lg" className="group w-full">
            Ir para o painel
            <IconArrowRight
              width={17}
              height={17}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Button>
        </Link>

        <p className="mt-4 text-xs text-muted">
          Você tem 14 dias grátis. Sem cartão de crédito.
        </p>
      </div>
    );
  }

  // ── Formulário ──────────────────────────────
  return (
    <div>
      {/* Marca (mobile) */}
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-fg">
          <IconScissors width={18} height={18} />
        </span>
        <span className="font-display text-xl text-ink">Salon AI</span>
      </div>

      <h1 className="font-display text-[2rem] leading-tight text-ink">
        {etapa === 1 ? "Criar meu salão" : "Sobre o seu salão"}
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        {etapa === 1
          ? "Comece grátis por 14 dias. Sem cartão de crédito."
          : "Só mais alguns dados para deixar tudo pronto."}
      </p>

      {/* Indicador de etapas */}
      <div className="mt-6 flex items-center gap-3">
        {[1, 2].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.7rem] font-semibold transition-colors",
                etapa >= n
                  ? "bg-primary text-primary-fg"
                  : "bg-ink/8 text-muted",
              )}
            >
              {etapa > n ? <IconCheck width={12} height={12} /> : n}
            </span>
            <span
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                etapa > n ? "bg-primary" : "bg-line",
              )}
            />
          </div>
        ))}
      </div>

      {/* ── Etapa 1: seus dados ── */}
      {etapa === 1 && (
        <form onSubmit={avancar} className="mt-6 space-y-4">
          <div>
            <Input
              label="Seu nome"
              name="nome"
              placeholder="Como podemos te chamar?"
              autoComplete="name"
              icon={<IconUser width={17} height={17} />}
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
            />
            {erros.nome && (
              <p className="mt-1 text-xs text-danger">{erros.nome}</p>
            )}
          </div>

          <div>
            <Input
              label="E-mail"
              name="email"
              type="email"
              placeholder="voce@salao.com.br"
              autoComplete="email"
              icon={<IconMail width={17} height={17} />}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {erros.email && (
              <p className="mt-1 text-xs text-danger">{erros.email}</p>
            )}
          </div>

          <div>
            <PasswordInput
              label="Senha"
              name="senha"
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
              value={form.senha}
              onChange={(e) => set("senha", e.target.value)}
            />
            {/* Medidor de força */}
            {form.senha && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        i < forca ? forcaMeta[forca].cor : "bg-line",
                      )}
                    />
                  ))}
                </div>
                <p className={cn("mt-1 text-xs", forcaMeta[forca].texto)}>
                  Segurança: {forcaMeta[forca].label}
                </p>
              </div>
            )}
            {erros.senha && (
              <p className="mt-1 text-xs text-danger">{erros.senha}</p>
            )}
          </div>

          <div>
            <PasswordInput
              label="Confirmar senha"
              name="confirmar"
              placeholder="Repita a senha"
              autoComplete="new-password"
              value={form.confirmar}
              onChange={(e) => set("confirmar", e.target.value)}
            />
            {erros.confirmar && (
              <p className="mt-1 text-xs text-danger">{erros.confirmar}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="group w-full">
            Continuar
            <IconArrowRight
              width={17}
              height={17}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Button>
        </form>
      )}

      {/* ── Etapa 2: dados do salão ── */}
      {etapa === 2 && (
        <form onSubmit={finalizar} className="mt-6 space-y-4">
          <div>
            <Input
              label="Nome do salão"
              name="nomeSalao"
              placeholder="Ex.: Studio Centro"
              icon={<IconStore width={17} height={17} />}
              value={form.nomeSalao}
              onChange={(e) => set("nomeSalao", e.target.value)}
            />
            {erros.nomeSalao && (
              <p className="mt-1 text-xs text-danger">{erros.nomeSalao}</p>
            )}
          </div>

          <div>
            <Input
              label="Telefone"
              name="telefone"
              placeholder="(11) 90000-0000"
              autoComplete="tel"
              icon={<IconPhone width={17} height={17} />}
              value={form.telefone}
              onChange={(e) => set("telefone", e.target.value)}
            />
            {erros.telefone && (
              <p className="mt-1 text-xs text-danger">{erros.telefone}</p>
            )}
          </div>

          {/* Tipo de negócio */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Tipo de negócio
            </p>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {tipos.map((t) => (
                <button
                  key={t.valor}
                  type="button"
                  onClick={() => set("tipo", t.valor)}
                  className={cn(
                    "h-11 rounded-xl border text-sm font-medium transition-colors",
                    form.tipo === t.valor
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-line bg-surface text-ink/70 hover:border-primary/40",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tamanho da equipe */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="tamanho"
              className="text-xs font-medium uppercase tracking-wide text-muted"
            >
              Tamanho da equipe
            </label>
            <select
              id="tamanho"
              value={form.tamanho}
              onChange={(e) => set("tamanho", e.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
            >
              {tamanhos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Termos */}
          <div>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.aceite}
                onChange={(e) => set("aceite", e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-[hsl(var(--primary))] focus:ring-2 focus:ring-primary/30"
              />
              <span>
                Li e aceito os{" "}
                <Link href="#" className="font-medium text-primary hover:text-accent">
                  Termos de uso
                </Link>{" "}
                e a{" "}
                <Link href="#" className="font-medium text-primary hover:text-accent">
                  Política de privacidade
                </Link>
                .
              </span>
            </label>
            {erros.aceite && (
              <p className="mt-1 text-xs text-danger">{erros.aceite}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setEtapa(1)}
              disabled={enviando}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              size="lg"
              className="group flex-1"
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-fg/30 border-t-primary-fg" />
                  Criando salão…
                </>
              ) : (
                <>
                  Criar meu salão
                  <IconArrowRight
                    width={17}
                    height={17}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      <div className="my-6 flex items-center gap-3 text-xs text-muted/70">
        <span className="h-px flex-1 bg-line" />
        ou
        <span className="h-px flex-1 bg-line" />
      </div>

      <p className="text-center text-sm text-muted">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary transition-colors hover:text-accent"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
