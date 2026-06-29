import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ProgressBar } from './components/ProgressBar';
import { ToastViewport } from './components/ToastViewport';
import { useRouteFocus } from './hooks/useRouteFocus';
import { ROUTES } from './utils/constants';

const Home = lazy(() => import('./pages/Home.jsx'));
const ImageToPdf = lazy(() => import('./pages/ImageToPdf.jsx'));
const PdfToImages = lazy(() => import('./pages/PdfToImages.jsx'));
const Recent = lazy(() => import('./pages/Recent.jsx'));

function routeFromHash() {
  const hash = window.location.hash.replace('#', '');
  return Object.values(ROUTES).includes(hash) ? hash : ROUTES.home;
}

function getPage(view) {
  if (view === ROUTES.imageToPdf) return ImageToPdf;
  if (view === ROUTES.pdfToImages) return PdfToImages;
  if (view === ROUTES.recent) return Recent;
  return Home;
}

export default function App() {
  const [view, setView] = useState(routeFromHash);
  const mainRef = useRouteFocus(view);

  useEffect(() => {
    const handleHashChange = () => setView(routeFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((route) => {
    const safeRoute = Object.values(ROUTES).includes(route) ? route : ROUTES.home;
    if (safeRoute === view) return;
    window.location.hash = safeRoute;
    setView(safeRoute);
  }, [view]);

  const Page = useMemo(() => getPage(view), [view]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar currentView={view} onNavigate={navigate} />
      <main ref={mainRef} tabIndex="-1" className="min-h-[calc(100vh-10rem)] flex-1 outline-none">
        <Suspense
          fallback={
            <div className="mx-auto max-w-xl px-4 py-20">
              <ProgressBar value={62} label="Loading SnapPDF" />
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Page onNavigate={navigate} />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer onNavigate={navigate} />
      <ToastViewport />
    </div>
  );
}
