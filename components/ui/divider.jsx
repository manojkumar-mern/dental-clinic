import React from "react";
import { cn } from "@/lib/utils";

export const Divider = React.forwardRef(
  ({ className, orientation = "horizontal", variant = "solid", label, ...props }, ref) => {
    const isHorizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          "flex items-center text-muted-foreground",
          isHorizontal ? "w-full flex-row my-6" : "h-full flex-col mx-6 inline-flex self-stretch",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "bg-border transition-colors",
            isHorizontal ? "h-[1px] w-full" : "w-[1px] h-full",
            variant === "dashed" && (isHorizontal ? "border-t border-dashed border-border bg-transparent" : "border-l border-dashed border-border bg-transparent")
          )}
        />
        {label && isHorizontal && (
          <span className="px-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap bg-background">
            {label}
          </span>
        )}
        {label && isHorizontal && (
          <span
            className={cn(
              "bg-border transition-colors h-[1px] w-full",
              variant === "dashed" && "border-t border-dashed border-border bg-transparent"
            )}
          />
        )}
      </div>
    );
  }
);

Divider.displayName = "Divider";
export default Divider;
