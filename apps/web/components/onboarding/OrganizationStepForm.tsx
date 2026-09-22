"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AvisoErro } from "@/components/auth/shared/AvisoErro";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useCreateOrganization } from "@/lib/api/hooks";

interface OrganizationStepFormProps {
  onCompleted: () => void;
}

export function OrganizationStepForm({ onCompleted }: OrganizationStepFormProps) {
  const [name, setName] = useState("");
  const createOrganization = useCreateOrganization();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createOrganization.mutate({ name }, { onSuccess: onCompleted });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted">
        Como se chama o seu negócio? Você pode ajustar isso depois.
      </p>

      <Input
        label="Nome do negócio"
        name="name"
        placeholder="Salão da Ana"
        autoFocus
        required
        minLength={2}
        maxLength={100}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      {createOrganization.isError && (
        <AvisoErro>
          {getErrorMessage(
            createOrganization.error,
            "Não foi possível criar o negócio. Tente novamente.",
          )}
        </AvisoErro>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={createOrganization.isPending}
      >
        {createOrganization.isPending ? "Criando..." : "Continuar"}
      </Button>
    </form>
  );
}
