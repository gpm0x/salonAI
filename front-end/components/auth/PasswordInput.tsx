"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { IconLock, IconEye, IconEyeOff } from "@/components/ui/icons";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function PasswordInput({
  label,
  className,
  id,
  ...props
}: PasswordInputProps) {
  const [visivel, setVisivel] = useState(false);
  const auto = useId();
  const inputId = id ?? props.name ?? auto;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-wide text-muted"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          <IconLock width={17} height={17} />
        </span>
        <input
          id={inputId}
          type={visivel ? "text" : "password"}
          className={cn(
            "h-11 w-full rounded-xl border border-line bg-surface px-3.5 pl-10 pr-11 text-sm text-ink",
            "placeholder:text-muted/70 transition-colors",
            "focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:bg-primary-soft/60 hover:text-primary"
        >
          {visivel ? (
            <IconEyeOff width={17} height={17} />
          ) : (
            <IconEye width={17} height={17} />
          )}
        </button>
      </div>
    </div>
  );
}
