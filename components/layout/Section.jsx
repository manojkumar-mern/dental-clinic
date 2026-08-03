import React from "react";
import { cn } from "@/lib/utils";

export const Section = React.forwardRef(({ className, size = "lg", as: Component = "section", ...props }, ref) => {
  const spacingClasses = {
    sm: "py-4 md:py-6",
    md: "py-8 md:py-10",
    lg: "py-12 md:py-14",
    xl: "py-16 md:py-20",
    none: "",
  };

  return (
    <Component
      ref={ref}
      className={cn("w-full relative overflow-hidden bg-background", spacingClasses[size], className)}
      {...props}
    />
  );
});

Section.displayName = "Section";
export default Section;
