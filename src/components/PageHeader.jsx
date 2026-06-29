import { motion } from 'framer-motion';
import { SecurityNote } from './SecurityNote';

export function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-slate-950 dark:text-white sm:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SecurityNote />
          {children}
        </div>
      </div>
    </motion.section>
  );
}
