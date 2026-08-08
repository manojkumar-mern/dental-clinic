"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  size = "md",
}) {
  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full m-0 h-full rounded-none",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className={cn(
              "relative w-full max-h-[90vh] overflow-hidden rounded-2xl bg-card text-card-foreground p-6 sm:p-8 shadow-premium border border-border flex flex-col gap-4 z-10",
              sizeClasses[size],
              className
            )}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-4 top-4 p-1 rounded-full text-muted-foreground hover:bg-alt-background hover:text-foreground transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            {(title || description) && (
              <div className="flex flex-col gap-1 pr-6 shrink-0">
                {title && (
                  <h2 id="modal-title" className="text-xl font-heading font-semibold text-foreground">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="modal-description" className="text-sm text-muted-foreground font-light leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Content Body */}
            <div className="w-full relative flex-1 overflow-y-auto pr-1 select-none">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
