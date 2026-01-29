import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-lg border border-input bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 md:text-sm",
  {
    variants: {
      variant: {
        default: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        premium: "border-gold/30 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20 shadow-soft",
        hero: "h-14 px-6 text-lg bg-white/95 backdrop-blur-sm border-white/30 shadow-elevated focus-visible:ring-2 focus-visible:ring-gold/30 placeholder:text-muted-foreground/70",
        search: "h-12 pl-12 pr-4 bg-card border-border shadow-soft focus-visible:shadow-elevated focus-visible:ring-2 focus-visible:ring-primary/20",
        admin: "font-admin focus-visible:ring-2 focus-visible:ring-admin-blue/30",
      },
      inputSize: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-3 py-1",
        lg: "h-12 px-4 py-3",
        xl: "h-14 px-6 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
