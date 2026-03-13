import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground hover:opacity-90": variant === "default",
          "border border-border bg-card text-foreground hover:bg-muted": variant === "outline",
          "text-foreground hover:bg-muted": variant === "ghost",
          "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
        },
        className,
      )}
      {...props}
    />
  );
}
