"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AvisoErro } from "@/components/auth/shared/AvisoErro";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useCreateProfessional } from "@/lib/api/hooks";

interface ProfessionalStepFormProps {
  salonId: string | undefined;
  onCompleted: () => void;
}

export function ProfessionalStepForm({
  salonId,
  onCompleted,
}: ProfessionalStepFormProps) {
  const [nome, setNome] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const createProfessional = useCreateProfessional();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createProfessional.mutate(
      {
        nome,
        especialidade: especialidade.trim() || undefined,
        telefone: telefone.trim() || undefined,
        salonId,
      },
      { onSuccess: onCompleted },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted">
        Cadastre o primeiro profissional que vai atender nessa unidade.
      </p>

      <Input
        label="Nome do profissional"
        name="nome"
        placeholder="Seu nome ou de quem vai atender"
        autoFocus
        required
        minLength={2}
        maxLength={100}
        value={nome}
        onChange={(event) => setNome(event.target.value)}
      />

      <Input
        label="Especialidade"
        name="especialidade"
        placeholder="Opcional (ex: Cabelo, Manicure)"
        value={especialidade}
        onChange={(event) => setEspecialidade(event.target.value)}
      />

      <Input
        label="Telefone"
        name="telefone"
        placeholder="Opcional"
        value={telefone}
        onChange={(event) => setTelefone(event.target.value)}
      />

      {createProfessional.isError && (
        <AvisoErro>
          {getErrorMessage(
            createProfessional.error,
            "Não foi possível cadastrar o profissional. Tente novamente.",
          )}
        </AvisoErro>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={createProfessional.isPending}
      >
        {createProfessional.isPending ? "Finalizando..." : "Concluir"}
      </Button>
    </form>
  );
}
