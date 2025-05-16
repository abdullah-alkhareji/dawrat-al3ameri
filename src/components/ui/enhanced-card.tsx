// src/components/ui/enhanced-card.tsx

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg border text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card",
        elevated: "bg-card shadow-md hover:shadow-lg",
        outline: "bg-background border-2 border-dashed",
        ghost: "border-transparent shadow-none",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-10",
      },
      interactive: {
        false: "",
        true: "cursor-pointer hover:bg-accent/50 hover:border-accent",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
);

interface CardContextValue {
  size: NonNullable<VariantProps<typeof cardVariants>["size"]>;
}

const CardContext = React.createContext<CardContextValue>({
  size: "default",
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant, size, interactive, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <CardContext.Provider value={{ size: size || "default" }}>
        <Comp
          ref={ref}
          className={cn(
            cardVariants({ variant, size, interactive, className })
          )}
          {...props}
        />
      </CardContext.Provider>
    );
  }
);
Card.displayName = "Card";

const cardHeaderVariants = cva("flex flex-col space-y-1.5", {
  variants: {
    size: {
      default: "pb-4",
      sm: "pb-3",
      lg: "pb-5",
      xl: "pb-6",
    },
  },
});

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { size } = React.useContext(CardContext);

  return (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ size, className }))}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const cardContentVariants = cva("", {
  variants: {
    size: {
      default: "pt-0",
      sm: "pt-0",
      lg: "pt-0",
      xl: "pt-0",
    },
  },
});

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { size } = React.useContext(CardContext);

  return (
    <div
      ref={ref}
      className={cn(cardContentVariants({ size, className }))}
      {...props}
    />
  );
});
CardContent.displayName = "CardContent";

const cardFooterVariants = cva("flex items-center", {
  variants: {
    size: {
      default: "pt-4",
      sm: "pt-3",
      lg: "pt-5",
      xl: "pt-6",
    },
  },
});

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { size } = React.useContext(CardContext);

  return (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ size, className }))}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
