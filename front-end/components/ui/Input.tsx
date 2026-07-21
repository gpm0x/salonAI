import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

export function Input({ label, icon, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
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
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink",
            "placeholder:text-muted/70 transition-colors",
            "focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10",
            icon ? "pl-10" : undefined,
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
}
