// src/components/index.ts

// Enhanced UI Components (with aliases for conflicting names)
export {
  Button as EnhancedButton,
  ButtonGroup,
  buttonVariants as enhancedButtonVariants,
  type ButtonProps as EnhancedButtonProps,
} from "./ui/enhanced-button";

export {
  Card as EnhancedCard,
  CardHeader as EnhancedCardHeader,
  CardFooter as EnhancedCardFooter,
  CardTitle as EnhancedCardTitle,
  CardDescription as EnhancedCardDescription,
  CardContent as EnhancedCardContent,
} from "./ui/enhanced-card";

export * from "./ui/layout";
export * from "./ui/typography";

// Original shadcn/ui Components (default exports)
export { Button, buttonVariants } from "./ui/button";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

// Other UI Components
export * from "./ui/input";
export * from "./ui/select";
export * from "./ui/form";
export * from "./ui/dialog";
export * from "./ui/tabs";
export * from "./ui/table";
export * from "./ui/badge";
export * from "./ui/avatar";
export * from "./ui/separator";
export * from "./ui/alert";

// Feature Components
export * from "./forms/application-form";
export * from "./forms/add-tournament-form";
export * from "./forms/edit-team-form";
export * from "./forms/login-form";
export * from "./forms/register-form";

// Layout Components
export { default as Navbar } from "./navbar";
export { default as MobileNav } from "./mobile-nav";
export { default as AppLogo } from "./app-logo";
export { default as AddTournamentButton } from "./add-tournament-button";

// Specialized Components
export { default as TournamentList } from "./tournament-list";
export { default as CopyButton } from "./copy-button";
export { default as ModeToggle } from "./mode-toggle";
export { default as LogoutButton } from "./logout-button";
export { default as Loader } from "./loader";

// Providers
export { ThemeProvider } from "./theme-provider";
