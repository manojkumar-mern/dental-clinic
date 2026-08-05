"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef(
  ({ className, hoverEffect = true, variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default: "border border-border bg-card text-card-foreground shadow-soft",
      premium: "border border-border/60 bg-card text-card-foreground shadow-premium backdrop-blur-[2px]",
      secondary: "bg-secondary/40 border border-secondary/20 text-secondary-foreground",
    };

    const hoverStyles = hoverEffect ? "hover:-translate-y-[2px] hover:shadow-md transition-all duration-300" : "";

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6 sm:p-8 flex flex-col gap-4 overflow-hidden relative",
          variantStyles[variant],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col gap-1.5", className)} {...props} />
);
CardHeader.displayName = "CardHeader";

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("font-heading text-xl font-medium tracking-tight text-foreground", className)} {...props} />
);
CardTitle.displayName = "CardTitle";

export const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground font-light leading-relaxed", className)} {...props} />
);
CardDescription.displayName = "CardDescription";

export const CardContent = ({ className, ...props }) => (
  <div className={cn("text-base leading-relaxed text-foreground/90", className)} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center pt-2 mt-auto", className)} {...props} />
);
CardFooter.displayName = "CardFooter";
