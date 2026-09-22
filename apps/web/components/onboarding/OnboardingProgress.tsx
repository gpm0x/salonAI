interface OnboardingProgressProps {
  currentIndex: number;
  total: number;
  label: string;
}

export function OnboardingProgress({
  currentIndex,
  total,
  label,
}: OnboardingProgressProps) {
  const percent = ((currentIndex + 1) / total) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted">
        <span>
          Passo {currentIndex + 1} de {total}
        </span>
        <span>{label}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
