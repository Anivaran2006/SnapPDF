import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200',
  accent:
    'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25 hover:bg-cyan-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300',
  secondary:
    'border border-slate-300/80 bg-white/70 text-slate-800 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15',
  danger:
    'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200',
  ghost:
    'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'min-h-12 px-5 py-3 text-base',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ y: props.disabled ? 0 : -1 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      type={type}
      className={[
        'focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-55',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4 shrink-0" /> : null}
      <span>{children}</span>
      {IconRight ? <IconRight aria-hidden="true" className="h-4 w-4 shrink-0" /> : null}
    </motion.button>
  );
}
