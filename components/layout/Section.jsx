import React from "react";
import { cn } from "@/lib/utils";

export const Section = React.forwardRef(({ className, size = "lg", as: Component = "section", ...props }, ref) => {
  const spacingClasses = {
    sm: "py-8 md:py-12",
    md: "py-16 md:py-24",
    lg: "py-20 md:py-32",
    xl: "py-28 md:py-40",
    none: "",
  };

  return (
    <Component
      ref={ref}
      className={cn("w-full relative overflow-hidden bg-background scroll-mt-20", spacingClasses[size], className)}
      {...props}
    />
  );
});

Section.displayName = "Section";
export default Section;
