"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});

Label.displayName = "Label";
export default Label;
