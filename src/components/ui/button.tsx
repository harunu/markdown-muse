import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-elevated",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Premium user UI variants
        hero: "bg-gradient-to-r from-gold to-gold-light text-primary font-semibold shadow-gold hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98]",
        premium: "bg-primary text-primary-foreground border border-gold/30 hover:border-gold shadow-soft hover:shadow-gold",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
        ai: "bg-gradient-to-r from-primary to-navy-light text-primary-foreground shadow-soft hover:shadow-elevated",
        // Admin UI variants
        admin: "bg-admin-blue text-white hover:bg-admin-blue/90 font-admin",
        adminSecondary: "bg-transparent border border-admin-slate/30 text-admin-slate hover:bg-admin-slate/5 font-admin",
        adminDanger: "bg-admin-error text-white hover:bg-admin-error/90 font-admin",
        adminSuccess: "bg-admin-success text-white hover:bg-admin-success/90 font-admin",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
