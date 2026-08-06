"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
    const delay = 2000;
    const timer = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(timer);
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.15,
      }
    }
  };

  const letterVariants = {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1],
      }
    }
  };

  const brandLetters = Array.from(BRAND_NAME);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="preloader"
            role="status"
            aria-label="Loading"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50"
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
            transition={reducedMotion ? { duration: 0.3, ease: "easeOut" } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Pulsing Logo with Glow Aura */}
            <div className="relative mb-6">
              <motion.div
                className="absolute -inset-4 rounded-full bg-primary/8 blur-xl"
                animate={reducedMotion ? undefined : {
                  scale: [1, 1.25, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={reducedMotion ? undefined : {
                  duration: 2.2,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              />
              <motion.div
                className="relative flex items-center justify-center size-40 rounded-[2.5rem] bg-light-green text-primary overflow-hidden shadow-premium border border-primary/10"
                initial={reducedMotion ? { opacity: 0, scale: 0.9 } : { opacity: 0, scale: 0.8 }}
                animate={reducedMotion ? { opacity: 1, scale: 1 } : { 
                  opacity: 1, 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 16px 24px -3px rgba(21, 128, 61, 0.1)",
                    "0 32px 40px -5px rgba(21, 128, 61, 0.2)",
                    "0 16px 24px -3px rgba(21, 128, 61, 0.1)"
                  ]
                }}
                transition={reducedMotion ? { duration: 0.3 } : {
                  scale: { duration: 2.2, ease: "easeInOut", repeat: Infinity },
                  opacity: { duration: 0.5, ease: "easeOut" }
                }}
              >
                <Image src="/logo.svg" alt="Aura Dental Logo" width={150} height={150} className="object-contain" priority />
              </motion.div>
            </div>

            {/* Staggered Brand Name Reveal */}
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="flex tracking-[0.2em] justify-center items-center mr-[-0.2em]"
            >
              {brandLetters.map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="font-heading font-extrabold text-2xl md:text-3xl text-primary select-none uppercase inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.div>

            {/* Tagline Reveal */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.05em" }}
              animate={{ opacity: 1, letterSpacing: "0.15em" }}
              transition={reducedMotion ? { duration: 0.2 } : { delay: 0.85, duration: 0.8, ease: "easeOut" }}
              className="mt-3 text-xs font-semibold tracking-widest text-emerald-800 uppercase opacity-75"
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
