export function OptionGroup({ label, value, options, onChange, columns = 'grid-cols-2' }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</legend>
      <div className={`grid gap-2 ${columns}`}>
        {options.map((option) => {
          const selected = value === option.value;
          const Icon = option.icon;
          return (
            <label key={option.value} className="min-w-0">
              <input
                type="radio"
                name={label}
                value={option.value}
                checked={selected}
                className="peer sr-only"
                onChange={() => onChange(option.value)}
              />
              <span
                className={[
                  'focus-ring flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-center text-sm font-medium transition',
                  selected
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200'
                    : 'border-slate-200 bg-white/60 text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-slate-200',
                ].join(' ')}
              >
                {Icon ? <Icon aria-hidden="true" className="h-4 w-4 shrink-0" /> : null}
                <span className="truncate">{option.label}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
