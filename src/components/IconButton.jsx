export function IconButton({ label, icon: Icon, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={[
        'focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300/70 bg-white/70 text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15',
        className,
      ].join(' ')}
      {...props}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
