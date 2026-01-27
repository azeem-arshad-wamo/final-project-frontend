import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors duration-300 ease-out shadow-sm hover:shadow-lg active:shadow-inner",
  {
    variants: {
      variant: {
        default: `
          bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground
          hover:from-primary/100 hover:to-primary/85
          active:from-primary/80 active:to-primary/60
        `,
        destructive: `
          bg-gradient-to-r from-destructive/90 to-destructive/70 text-white
          hover:from-destructive/100 hover:to-destructive/85
          active:from-destructive/80 active:to-destructive/60
        `,
        outline: `
          border bg-background shadow-xs text-foreground
          hover:bg-accent hover:text-accent-foreground
          active:bg-accent/80
        `,
        secondary: `
          bg-gradient-to-r from-secondary/90 to-secondary/70 text-secondary-foreground
          hover:from-secondary/100 hover:to-secondary/85
          active:from-secondary/80 active:to-secondary/60
        `,
        ghost: `
          bg-transparent hover:bg-accent hover:text-accent-foreground
          active:bg-accent/70 dark:hover:bg-accent/50 dark:active:bg-accent/60
        `,
        link: "text-primary underline-offset-4 hover:underline active:text-primary/70",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
