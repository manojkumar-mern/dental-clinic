import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("transition-colors", {
  variants: {
    variant: {
      display: "font-heading text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground",
      h1: "font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground",
      h2: "font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground",
      h3: "font-heading text-2xl sm:text-3xl font-medium tracking-tight text-foreground",
      h4: "font-heading text-xl sm:text-2xl font-medium tracking-tight text-foreground",
      h5: "font-heading text-lg sm:text-xl font-medium tracking-tight text-foreground",
      bodyLarge: "text-lg text-muted-foreground font-light leading-relaxed",
      body: "text-base text-foreground font-normal leading-relaxed",
      small: "text-sm text-muted-foreground font-normal leading-normal",
      caption: "text-xs text-muted-foreground uppercase tracking-widest font-semibold",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export const Typography = React.forwardRef(({ className, variant, as, ...props }, ref) => {
  const defaultElements = {
    display: "h1",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    bodyLarge: "p",
    body: "p",
    small: "p",
    caption: "span",
  };

  const Component = as || (variant ? defaultElements[variant] : "p") || "p";

  return (
    <Component
      ref={ref}
      className={cn(typographyVariants({ variant, className }))}
      {...props}
    />
  );
});

Typography.displayName = "Typography";
export { typographyVariants };
export default Typography;
