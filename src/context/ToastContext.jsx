import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createId } from '../utils/fileUtils';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message = '', type = 'info', duration = 4600 }) => {
      const id = createId();
      setToasts((items) => [...items, { id, title, message, type }]);
      window.setTimeout(() => removeToast(id), duration);
      return id;
    },
    [removeToast],
  );

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
