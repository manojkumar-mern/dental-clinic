import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  className,
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-2xl bg-card/30 backdrop-blur-[2px] max-w-lg mx-auto",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="size-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground mb-4">
          <Icon className="size-6" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="font-heading text-lg font-medium text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
