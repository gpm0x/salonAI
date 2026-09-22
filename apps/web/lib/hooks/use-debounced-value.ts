"use client";

import { useEffect, useState } from "react";

/** Atrasa a propagação de `value` em `delayMs`, útil pra inputs de busca. */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
