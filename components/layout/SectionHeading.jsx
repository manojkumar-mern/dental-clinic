"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SectionHeading = React.forwardRef(
  ({ className, title, tagline, description, align = "center", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col mb-12 md:mb-16 max-w-3xl",
          align === "center" ? "mx-auto text-center items-center" : "text-left items-start",
          className
        )}
        {...props}
      >
        {tagline && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xs font-semibold uppercase tracking-widest text-primary bg-light-green px-3 py-1 rounded-full mb-3 inline-block"
          >
            {tagline}
          </motion.span>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold tracking-tight text-foreground"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed font-light"
          >
            {description}
          </motion.p>
        )}
      </div>
    );
  }
);

SectionHeading.displayName = "SectionHeading";
export default SectionHeading;
