"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const DEFAULT_VIEWPORT = { once: true, amount: 0.2 };
const DEFAULT_DURATION = 0.6;

// Shared variants
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DEFAULT_DURATION, ease: "easeOut" },
  },
};

export const slideInLeftVariant = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DEFAULT_DURATION, ease: "easeOut" },
  },
};

export const slideInRightVariant = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DEFAULT_DURATION, ease: "easeOut" },
  },
};

export const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function FadeUp({ children, className, delay = 0 }) {
  return (
    <motion.div
      variants={{
        hidden: fadeUpVariant.hidden,
        visible: {
          ...fadeUpVariant.visible,
          transition: { ...fadeUpVariant.visible.transition, delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={DEFAULT_VIEWPORT}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInLeft({ children, className, delay = 0 }) {
  return (
    <motion.div
      variants={{
        hidden: slideInLeftVariant.hidden,
        visible: {
          ...slideInLeftVariant.visible,
          transition: { ...slideInLeftVariant.visible.transition, delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={DEFAULT_VIEWPORT}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInRight({ children, className, delay = 0 }) {
  return (
    <motion.div
      variants={{
        hidden: slideInRightVariant.hidden,
        visible: {
          ...slideInRightVariant.visible,
          transition: { ...slideInRightVariant.visible.transition, delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={DEFAULT_VIEWPORT}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className }) {
  return (
    <motion.div
      variants={staggerContainerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={DEFAULT_VIEWPORT}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }) {
  return (
    <motion.div variants={fadeUpVariant} className={className}>
      {children}
    </motion.div>
  );
}
