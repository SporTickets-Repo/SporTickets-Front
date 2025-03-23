import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        "default-inverse":
          "bg-sporticket-purple-50 text-purple-primary shadow hover:bg-sporticket-purple-50/80",
        destructive:
          "bg-sporticket-orange text-white hover:bg-sporticket-orange/90",
        outline: "text-zinc-800 hover:text-zinc-600 text-sm",
        secondary:
          "bg-sporticket-blue text-md font-bold text-sporticket-purple shadow-sm hover:bg-sporticket-blue/80",
        tertiary:
          "bg-neutral-100 text-sporticket-blue-600 shadow-sm hover:bg-neutral-100/90",
        link: "text-sporticket-orange underline mt-1 h-auto p-0 text-sm font-medium hover:text-sporticket-orange/60",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        select: "bg-sporticket-purple text-white hover:sporticket-purple/90",
      },
      size: {
        default: "h-12 px-6 py-4",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-10 rounded-xl px-8",
        xl: "h-10 rounded-xl px-40",
        icon: "h-5 w-5 rounded",
        outline: "h-12 px-1 py-4",
        trash: "h-[80px] px-4 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
