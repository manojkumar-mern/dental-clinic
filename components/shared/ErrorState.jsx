"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ErrorState({
  className,
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again or contact support if the issue persists.",
  error,
  reset,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-destructive/10 rounded-2xl bg-destructive/5 max-w-lg mx-auto",
        className
      )}
      {...props}
    >
      <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
        <AlertCircle className="size-6" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-lg font-medium text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
        {description}
      </p>
      {error?.message && (
        <pre className="w-full text-left p-3 mb-6 bg-destructive/5 border border-destructive/10 rounded-lg text-xs font-mono text-destructive overflow-auto max-h-[120px]">
          {error.message}
        </pre>
      )}
      {reset && (
        <Button onClick={reset} variant="destructive" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
