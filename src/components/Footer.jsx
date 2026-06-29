import { Github } from 'lucide-react';
import { ROUTES } from '../utils/constants';

export function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-white/50 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 dark:text-slate-300 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p className="font-medium">SnapPDF keeps conversion private with browser-only processing.</p>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={() => onNavigate(ROUTES.home)} className="focus-ring rounded-lg hover:text-slate-950 dark:hover:text-white">
            About
          </button>
          <button type="button" onClick={() => onNavigate(ROUTES.home)} className="focus-ring rounded-lg hover:text-slate-950 dark:hover:text-white">
            Privacy Policy
          </button>
          <a href="mailto:hello@snappdf.local" className="focus-ring rounded-lg hover:text-slate-950 dark:hover:text-white">
            Contact
          </a>
          <a href="https://github.com/" className="focus-ring inline-flex items-center gap-1 rounded-lg hover:text-slate-950 dark:hover:text-white">
            <Github aria-hidden="true" className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
