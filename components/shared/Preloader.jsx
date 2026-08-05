"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Stethoscope } from "lucide-react";

const BRAND_NAME = "AURA DENTAL";
const TAGLINE = "Creating Healthy Smiles";

export function Preloader({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const alreadyLoaded =
      document.readyState === "complete" ||
      performance.getEntriesByType?.("navigation")[0]?.type === "back_forward";

    const delay = alreadyLoaded ? 200 : mq.matches ? 600 : 1250;
    const timer = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(timer);
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="preloader"
            role="status"
            aria-label="Loading"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
            transition={reducedMotion ? { duration: 0.3, ease: "easeOut" } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Brand mark */}
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <span className="flex items-center justify-center size-12 rounded-2xl bg-light-green text-primary">
                <Stethoscope className="size-6" strokeWidth={2.25} />
              </span>
              <span className="font-heading font-semibold text-xl tracking-tight text-primary uppercase">
                {BRAND_NAME}
              </span>
            </motion.div>

            {/* Thin circular loader */}
            <motion.div
              aria-hidden="true"
              className="relative size-11 mt-8"
              animate={reducedMotion ? undefined : { rotate: 360 }}
              transition={reducedMotion ? undefined : { duration: 1.2, ease: "linear", repeat: Infinity }}
            >
              <svg className="size-full" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="19.5" stroke="#15803D" strokeOpacity="0.14" strokeWidth="2" />
                <circle
                  cx="22"
                  cy="22"
                  r="19.5"
                  stroke="#15803D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="38 85"
                />
              </svg>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={reducedMotion ? { duration: 0.2 } : { delay: 0.35, duration: 0.45 }}
              className="mt-5 text-sm font-light tracking-wide text-slate-500"
            >
              {TAGLINE}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content fades in as the preloader fades out */}
      <motion.div
        initial={false}
        animate={visible ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}

export default Preloader;
