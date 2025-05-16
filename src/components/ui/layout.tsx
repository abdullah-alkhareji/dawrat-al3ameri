// src/components/ui/layout.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Container Component
const containerVariants = cva(
  "mx-auto w-full",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full",
      },
      padding: {
        none: "px-0",
        sm: "px-4",
        md: "px-6",
        lg: "px-8",
      },
    },
    defaultVariants: {
      size: "2xl",
      padding: "md",
    },
  }
);

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ size, padding, className }))}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

// Grid Component with responsive patterns
const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        auto: "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]",
        "auto-sm": "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
        "auto-lg": "grid-cols-[repeat(auto-fit,minmax(320px,1fr))]",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: "md",
    },
  }
);

interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(gridVariants({ cols, gap, className }))}
        {...props}
      />
    );
  }
);
Grid.displayName = "Grid";

// Flex Component
const flexVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        "row-reverse": "flex-row-reverse",
        col: "flex-col",
        "col-reverse": "flex-col-reverse",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      wrap: {
        wrap: "flex-wrap",
        nowrap: "flex-nowrap",
        "wrap-reverse": "flex-wrap-reverse",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
    defaultVariants: {
      direction: "row",
      align: "center",
      justify: "start",
      wrap: "nowrap",
      gap: "md",
    },
  }
);

interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, align, justify, wrap, gap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          flexVariants({ direction, align, justify, wrap, gap, className })
        )}
        {...props}
      />
    );
  }
);
Flex.displayName = "Flex";

// Stack Component (vertical by default)
interface StackProps extends Omit<FlexProps, "direction"> {
  spacing?: VariantProps<typeof flexVariants>["gap"];
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ spacing, gap, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction="col"
        gap={spacing || gap}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";

// HStack Component (horizontal stack)
interface HStackProps extends Omit<FlexProps, "direction"> {
  spacing?: VariantProps<typeof flexVariants>["gap"];
}

const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ spacing, gap, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction="row"
        gap={spacing || gap}
        {...props}
      />
    );
  }
);
HStack.displayName = "HStack";

// Section Component
const sectionVariants = cva(
  "w-full",
  {
    variants: {
      padding: {
        none: "py-0",
        sm: "py-8",
        md: "py-12",
        lg: "py-16",
        xl: "py-24",
      },
      background: {
        transparent: "bg-transparent",
        default: "bg-background",
        muted: "bg-muted/50",
        accent: "bg-accent/50",
      },
    },
    defaultVariants: {
      padding: "md",
      background: "transparent",
    },
  }
);

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, padding, background, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(sectionVariants({ padding, background, className }))}
        {...props}
      />
    );
  }
);
Section.displayName = "Section";

export {
  Container,
  Grid,
  Flex,
  Stack,
  HStack,
  Section,
  containerVariants,
  gridVariants,
  flexVariants,
  sectionVariants,
};