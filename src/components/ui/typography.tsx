// src/components/ui/typography.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva(
  "text-foreground",
  {
    variants: {
      variant: {
        h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
        h4: "scroll-m-20 text-xl font-semibold tracking-tight",
        h5: "scroll-m-20 text-lg font-semibold tracking-tight",
        h6: "scroll-m-20 text-base font-semibold tracking-tight",
        p: "leading-7 [&:not(:first-child)]:mt-6",
        blockquote: "mt-6 border-l-2 pl-6 italic",
        lead: "text-xl text-muted-foreground",
        large: "text-lg font-semibold",
        small: "text-sm font-medium leading-none",
        muted: "text-sm text-muted-foreground",
        subtle: "text-xs text-muted-foreground/70",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
      },
      textColor: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        destructive: "text-destructive",
        accent: "text-accent-foreground",
        success: "text-green-600",
        warning: "text-yellow-600",
        info: "text-blue-600",
      },
    },
    defaultVariants: {
      variant: "p",
      align: "left",
      textColor: "default",
    },
  }
);

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: React.ElementType;
  truncate?: boolean;
  noSelect?: boolean;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      variant,
      align,
      weight,
      textColor,
      as,
      truncate = false,
      noSelect = false,
      ...props
    },
    ref
  ) => {
    // Determine the component to render
    let Component: React.ElementType = "p";
    
    if (as) {
      Component = as;
    } else if (variant && typeof variant === "string" && variant.startsWith("h")) {
      Component = variant as React.ElementType;
    } else if (variant === "blockquote") {
      Component = "blockquote";
    }
    
    return (
      <Component
        ref={ref}
        className={cn(
          textVariants({ variant, align, weight, textColor }),
          {
            "truncate": truncate,
            "select-none": noSelect,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

// Heading component with proper typing
interface HeadingProps extends Omit<TextProps, "variant"> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, ...props }, ref) => {
    const variant = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    
    return (
      <Text
        ref={ref as React.ForwardedRef<HTMLElement>}
        variant={variant}
        as={variant}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

// Code component
const codeVariants = cva(
  "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-border",
        ghost: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeVariants> {}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(codeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Code.displayName = "Code";

// Prose wrapper for rich text content
const Prose = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "prose prose-gray dark:prose-invert max-w-none",
      "prose-headings:tracking-tight prose-headings:scroll-mt-20",
      "prose-lead:text-muted-foreground",
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      "prose-pre:bg-muted prose-pre:border",
      "prose-ol:list-decimal prose-ul:list-disc",
      className
    )}
    {...props}
  />
));
Prose.displayName = "Prose";

export { Text, Heading, Code, Prose, textVariants, codeVariants };