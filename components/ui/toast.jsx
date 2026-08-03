"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((message, type = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, [dismiss]);

  const toast = {
    show,
    success: (msg, dur) => show(msg, "success", dur),
    error: (msg, dur) => show(msg, "error", dur),
    warning: (msg, dur) => show(msg, "warning", dur),
    info: (msg, dur) => show(msg, "info", dur),
  };

  const icons = {
    success: <CheckCircle className="size-5 text-success" />,
    error: <AlertCircle className="size-5 text-error" />,
    warning: <AlertTriangle className="size-5 text-warning" />,
    info: <Info className="size-5 text-primary" />,
  };

  const borderColors = {
    success: "border-success/20 bg-success/5",
    error: "border-error/20 bg-error/5",
    warning: "border-warning/20 bg-warning/5",
    info: "border-primary/20 bg-primary/5",
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={cn(
                "w-full pointer-events-auto border rounded-xl p-4 bg-card text-card-foreground shadow-premium flex items-start gap-3 relative overflow-hidden",
                borderColors[t.type]
              )}
            >
              {icons[t.type]}
              <div className="flex-1 text-sm font-medium pr-6 leading-relaxed">
                {t.message}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Dismiss toast"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
