import { FileImage, Files, Github, History, Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/snap-pdf-mark.svg';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../utils/constants';
import { IconButton } from './IconButton';

const navItems = [
  { route: ROUTES.imageToPdf, label: 'Images to PDF', icon: FileImage },
  { route: ROUTES.pdfToImages, label: 'PDF to Images', icon: Files },
  { route: ROUTES.recent, label: 'Recent Files', icon: History },
];

export function Navbar({ currentView, onNavigate }) {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (route) => {
    onNavigate(route);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Primary">
        <button
          type="button"
          onClick={() => go(ROUTES.home)}
          className="focus-ring flex items-center gap-3 rounded-lg text-left"
        >
          <img src={logo} alt="" className="h-10 w-10" />
          <span>
            <span className="block text-lg font-black tracking-normal text-slate-950 dark:text-white">SnapPDF</span>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300 sm:block">
              Local converter
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => go(item.route)}
                className={[
                  'focus-ring inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition',
                  active
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10',
                ].join(' ')}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/"
            className="focus-ring hidden h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10 sm:inline-flex"
          >
            <Github aria-hidden="true" className="h-4 w-4" />
            GitHub
          </a>
          <IconButton label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} icon={isDark ? Sun : Moon} onClick={toggleTheme} />
          <IconButton
            label={menuOpen ? 'Close menu' : 'Open menu'}
            icon={menuOpen ? X : Menu}
            onClick={() => setMenuOpen((open) => !open)}
            className="lg:hidden"
          />
        </div>
      </nav>

      {menuOpen ? (
        <div className="border-t border-slate-200/80 px-4 py-3 dark:border-white/10 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => go(item.route)}
                  className="focus-ring flex h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-900/5 dark:text-slate-100 dark:hover:bg-white/10"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
