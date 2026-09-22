"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AvisoErro } from "@/components/auth/shared/AvisoErro";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useCreateSalon } from "@/lib/api/hooks";

interface SalonStepFormProps {
  onCompleted: (salonId: string) => void;
}

export function SalonStepForm({ onCompleted }: SalonStepFormProps) {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cadeiras, setCadeiras] = useState(1);
  const createSalon = useCreateSalon();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createSalon.mutate(
      {
        nome,
        endereco: endereco.trim() || undefined,
        telefone: telefone.trim() || undefined,
        cadeiras,
        // Primeira unidade cadastrada no onboarding é sempre a principal.
        principal: true,
      },
      { onSuccess: (data) => onCompleted(data.salonId) },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted">
        Cadastre a primeira unidade do seu negócio.
      </p>

      <Input
        label="Nome da unidade"
        name="nome"
        placeholder="Unidade Centro"
        autoFocus
        required
        minLength={2}
        maxLength={100}
        value={nome}
        onChange={(event) => setNome(event.target.value)}
      />

      <Input
        label="Endereço"
        name="endereco"
        placeholder="Opcional"
        value={endereco}
        onChange={(event) => setEndereco(event.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Telefone"
          name="telefone"
          placeholder="Opcional"
          value={telefone}
          onChange={(event) => setTelefone(event.target.value)}
        />
        <Input
          label="Cadeiras"
          name="cadeiras"
          type="number"
          min={1}
          max={500}
          value={cadeiras}
          onChange={(event) => setCadeiras(Number(event.target.value) || 1)}
        />
      </div>

      {createSalon.isError && (
        <AvisoErro>
          {getErrorMessage(
            createSalon.error,
            "Não foi possível criar a unidade. Tente novamente.",
          )}
        </AvisoErro>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={createSalon.isPending}
      >
        {createSalon.isPending ? "Criando..." : "Continuar"}
      </Button>
    </form>
  );
}
