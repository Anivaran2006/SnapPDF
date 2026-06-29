import { ShieldCheck } from 'lucide-react';

export function SecurityNote({ compact = false }) {
  return (
    <div
      className={[
        'inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200',
        compact ? '' : 'shadow-sm',
      ].join(' ')}
    >
      <ShieldCheck aria-hidden="true" className="h-4 w-4" />
      <span>🔒 Your files never leave your device.</span>
    </div>
  );
}
