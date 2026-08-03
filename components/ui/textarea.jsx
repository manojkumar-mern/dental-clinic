import React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef(
  ({ className, error, label, helperText, id, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full rounded-lg border border-input bg-card px-4 py-3 text-sm transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 outline-none placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[80px]",
            error && "border-error focus-visible:border-error focus-visible:ring-error/20",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs text-error font-medium mt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-muted-foreground font-light mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
