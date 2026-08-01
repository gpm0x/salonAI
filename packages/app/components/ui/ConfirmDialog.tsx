"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { IconTrash } from "@/components/ui/icons";

interface ConfirmDialogProps {
  open: boolean;
  titulo: string;
  mensagem: string;
  confirmarLabel?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({
  open,
  titulo,
  mensagem,
  confirmarLabel = "Excluir",
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancelar} title={titulo} className="max-w-md">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-danger/12 text-danger">
          <IconTrash width={20} height={20} />
        </span>
        <p className="text-sm text-muted">{mensagem}</p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirmar}
          className="bg-danger text-white hover:bg-danger/90"
        >
          {confirmarLabel}
        </Button>
      </div>
    </Modal>
  );
}
