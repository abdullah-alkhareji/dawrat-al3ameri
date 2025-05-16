// src/components/ui/enhanced-loading.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
    />
  );
};

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title = "جاري التحميل...",
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 bg-card rounded-lg border",
        "animate-pulse",
        className
      )}
    >
      <LoadingSpinner size="lg" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)}>
      {children}
    </div>
  );
};

// Skeleton components for different layouts
export const TournamentCardSkeleton: React.FC = () => (
  <div className="bg-card rounded-lg p-4 border space-y-3">
    <Skeleton className="h-6 w-3/4" />
    <div className="flex space-x-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
  </div>
);

export const MatchCardSkeleton: React.FC = () => (
  <div className="bg-card p-4 rounded-lg border space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-4" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
    <Skeleton className="h-8 w-full" />
  </div>
);

export const TeamTableSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="grid grid-cols-8 gap-4 p-3 border rounded">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-8" />
      </div>
    ))}
  </div>
);
