import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function Spinner({ className, size = "md", ...props }) {
  const sizeClasses = {
    sm: "size-4 border-2",
    md: "size-8 border-2",
    lg: "size-12 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-muted border-t-primary-foreground/80",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="loading"
      {...props}
    />
  );
}

export { Skeleton };

export function LoadingOverlay({ className, message = "Loading...", ...props }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm font-medium tracking-wide text-muted-foreground/90 uppercase">{message}</p>
      </div>
    </div>
  );
}
