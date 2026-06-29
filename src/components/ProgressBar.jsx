export function ProgressBar({ value = 0, label = 'Progress' }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-2" role="status" aria-live="polite">
      <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-rose-400 transition-all duration-300"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
