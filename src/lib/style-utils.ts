// src/lib/style-utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Enhanced className utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Create responsive styles helper
export function responsive(styles: {
  default?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
}) {
  const classes: string[] = [];
  
  if (styles.default) classes.push(styles.default);
  if (styles.sm) classes.push(`sm:${styles.sm}`);
  if (styles.md) classes.push(`md:${styles.md}`);
  if (styles.lg) classes.push(`lg:${styles.lg}`);
  if (styles.xl) classes.push(`xl:${styles.xl}`);
  if (styles["2xl"]) classes.push(`2xl:${styles["2xl"]}`);
  
  return classes.join(" ");
}

// Focus ring utility
export function focusRing(color = "ring-primary") {
  return `focus:outline-none focus-visible:ring-2 focus-visible:${color} focus-visible:ring-offset-2`;
}

// Create animation classes
export function createAnimation(
  name: string,
  keyframes: string,
  duration = "1s",
  timing = "ease-in-out"
) {
  return {
    [`@keyframes ${name}`]: keyframes,
    [`.animate-${name}`]: {
      animation: `${name} ${duration} ${timing}`,
    },
  };
}

// Color variants generator
export function createColorVariants(baseColor: string) {
  return {
    50: `${baseColor}-50`,
    100: `${baseColor}-100`,
    200: `${baseColor}-200`,
    300: `${baseColor}-300`,
    400: `${baseColor}-400`,
    500: `${baseColor}-500`,
    600: `${baseColor}-600`,
    700: `${baseColor}-700`,
    800: `${baseColor}-800`,
    900: `${baseColor}-900`,
    950: `${baseColor}-950`,
  };
}

// Spacing scale helper
export function spacing(value: number, unit: "rem" | "px" = "rem") {
  return `${value}${unit}`;
}

// Typography scale helper
export function fontSize(
  size: string,
  lineHeight?: string,
  letterSpacing?: string
) {
  const styles = [`text-${size}`];
  
  if (lineHeight) styles.push(`leading-${lineHeight}`);
  if (letterSpacing) styles.push(`tracking-${letterSpacing}`);
  
  return styles.join(" ");
}

// RTL support utilities
export function rtl(ltrClass: string, rtlClass: string) {
  return `${ltrClass} rtl:${rtlClass}`;
}

export function ltr(className: string) {
  return `ltr:${className}`;
}

// State variants helper
export function stateVariants(states: {
  default?: string;
  hover?: string;
  focus?: string;
  active?: string;
  disabled?: string;
  loading?: string;
}) {
  const classes: string[] = [];
  
  if (states.default) classes.push(states.default);
  if (states.hover) classes.push(`hover:${states.hover}`);
  if (states.focus) classes.push(`focus:${states.focus}`);
  if (states.active) classes.push(`active:${states.active}`);
  if (states.disabled) classes.push(`disabled:${states.disabled}`);
  if (states.loading) classes.push(`data-[loading=true]:${states.loading}`);
  
  return classes.join(" ");
}

// Container query utilities
export function containerQuery(size: string, className: string) {
  return `@container/${size} (min-width: ${size}) .${className}`;
}

// Dark mode utilities
export function darkMode(lightClass: string, darkClass?: string) {
  if (!darkClass) return lightClass;
  return `${lightClass} dark:${darkClass}`;
}

// Gradient utilities
export function gradient(
  direction: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl",
  fromColor: string,
  toColor: string,
  viaColor?: string
) {
  const classes = [`bg-gradient-${direction}`, `from-${fromColor}`, `to-${toColor}`];
  
  if (viaColor) {
    classes.splice(2, 0, `via-${viaColor}`);
  }
  
  return classes.join(" ");
}

// Glassmorphism effect
export function glassmorphism(opacity = "10") {
  return `backdrop-blur-sm bg-white/10 dark:bg-black/${opacity} border border-white/20`;
}

// Print styles helper
export function printStyles(className: string) {
  return `print:${className}`;
}