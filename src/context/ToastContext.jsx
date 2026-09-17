import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type, message, title, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message, title) => showToast('success', message, title), [showToast]);
  const error = useCallback((message, title) => showToast('error', message, title || 'Error'), [showToast]);
  const warning = useCallback((message, title) => showToast('warning', message, title || 'Notice'), [showToast]);
  const info = useCallback((message, title) => showToast('info', message, title), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
              error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-amber shrink-0" />,
              info: <Info className="w-5 h-5 text-cyan shrink-0" />,
            };

            const borderColors = {
              success: 'border-emerald-500/40 bg-navy-dark/95 text-white',
              error: 'border-rose-500/40 bg-navy-dark/95 text-white',
              warning: 'border-amber/40 bg-navy-dark/95 text-white',
              info: 'border-cyan/40 bg-navy-dark/95 text-white',
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`pointer-events-auto p-4 rounded-sm border shadow-2xl backdrop-blur-md flex items-start gap-3 relative overflow-hidden ${borderColors[toast.type]}`}
              >
                <div className="mt-0.5">{icons[toast.type]}</div>
                <div className="flex-1 pr-6">
                  {toast.title && (
                    <h4 className="font-heading font-semibold text-sm tracking-wide text-gray-100">
                      {toast.title}
                    </h4>
                  )}
                  <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed mt-0.5">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
