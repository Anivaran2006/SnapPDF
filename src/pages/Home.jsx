import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowRightLeft,
  CheckCircle2,
  FileImage,
  FileText,
  LockKeyhole,
  MousePointerClick,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '../components/Button';
import { SecurityNote } from '../components/SecurityNote';
import { ROUTES } from '../utils/constants';

const features = [
  {
    icon: Zap,
    title: 'Fast conversion',
    copy: 'Optimized browser processing turns batches of images and PDF pages into export-ready files quickly.',
  },
  {
    icon: LockKeyhole,
    title: 'Private by design',
    copy: 'Files are read locally through browser APIs, so documents stay on your device from upload to download.',
  },
  {
    icon: MousePointerClick,
    title: 'Simple workflow',
    copy: 'Drag, preview, reorder, tune quality, and export without account prompts or server queues.',
  },
];

function ConverterPreview() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-4 rounded-lg bg-gradient-to-br from-cyan-400/25 via-emerald-300/20 to-rose-400/25 blur-2xl" />
      <div className="glass-panel relative overflow-hidden p-4">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Local session
          </span>
        </div>

        <div className="grid gap-4 pt-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="grid gap-3">
            {[0, 1, 2].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item * 0.08 }}
                className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                    <FileImage aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">image-{item + 1}.jpg</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Ready</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
            <ArrowRightLeft aria-hidden="true" className="h-5 w-5" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.24 }}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/10"
          >
            <div className="mx-auto flex h-24 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-slate-950 to-cyan-700 text-white shadow-lg">
              <FileText aria-hidden="true" className="h-9 w-9" />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              Export ready
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Home({ onNavigate }) {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:pb-16 lg:pt-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <SecurityNote />
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/70 bg-white/60 px-3 py-2 text-sm font-semibold text-slate-700 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              <Sparkles aria-hidden="true" className="h-4 w-4 text-rose-500" />
              Free browser conversion
            </span>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">SnapPDF</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-normal text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Image ↔ PDF Converter
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
            Convert Images to PDF and PDF to Images instantly. Fast, Secure, Free.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="accent" icon={FileImage} iconRight={ArrowRight} onClick={() => onNavigate(ROUTES.imageToPdf)}>
              Convert Images to PDF
            </Button>
            <Button size="lg" variant="primary" icon={FileText} iconRight={ArrowRight} onClick={() => onNavigate(ROUTES.pdfToImages)}>
              Convert PDF to Images
            </Button>
          </div>
        </motion.div>

        <ConverterPreview />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.08 }}
                className="tool-card p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-slate-950 dark:text-white">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </section>
    </>
  );
}
