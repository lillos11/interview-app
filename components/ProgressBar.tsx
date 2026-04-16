interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

export function ProgressBar({ label, current, target, unit = '' }: ProgressBarProps) {
  const safeTarget = target <= 0 ? 1 : target;
  const percent = Math.min(100, Math.round((current / safeTarget) * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">
          {current}/{target} {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-sky-500 transition-all"
          style={{ width: `${percent}%` }}
          aria-label={`${label} ${percent}%`}
        />
      </div>
    </div>
  );
}
