// src/components/ui/composed-components.tsx

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "./enhanced-card";
import { Flex, Stack } from "./layout";

// Enhanced Form Field Composition
interface FormFieldComposition {
  children: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function FormFieldComposition({
  children,
  label,
  description,
  error,
  required,
  className,
}: FormFieldComposition) {
  return (
    <Stack spacing="sm" className={className}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </Stack>
  );
}

// Page Header Composition
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {breadcrumbs}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}

// Stats Card Composition
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  description,
  className,
}: StatsCardProps) {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn("text-xs", changeColors[changeType])}>{change}</p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Action Button Group Composition
interface ActionButtonGroupProps {
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  } & Omit<ButtonProps, "onClick" | "children">;
  secondaryActions?: Array<
    {
      label: string;
      onClick: () => void;
    } & Omit<ButtonProps, "onClick" | "children">
  >;
  className?: string;
}

export function ActionButtonGroup({
  primaryAction,
  secondaryActions = [],
  className,
}: ActionButtonGroupProps) {
  return (
    <Flex gap="sm" className={className}>
      {primaryAction && (
        <Button {...primaryAction} onClick={primaryAction.onClick}>
          {primaryAction.label}
        </Button>
      )}
      {secondaryActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          {...action}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </Flex>
  );
}

// Empty State Composition
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  } & Omit<ButtonProps, "onClick" | "children">;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button {...action} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Loading State Composition
interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingState({
  message = "جاري التحميل...",
  size = "md",
  className,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-32",
    md: "h-64",
    lg: "h-96",
  };

  const spinnerSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        sizeClasses[size],
        className
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-muted border-t-primary",
          spinnerSizes[size]
        )}
      />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// Error State Composition
interface ErrorStateProps {
  title: string;
  description?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  description,
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <svg
          className="h-8 w-8 text-destructive"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        )}
      </div>
      {retry && (
        <Button onClick={retry} variant="outline">
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
