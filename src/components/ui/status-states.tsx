// src/components/ui/status-states.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Trophy,
  Users,
  Calendar
} from "lucide-react";

interface StatusCardProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  type,
  title,
  description,
  action,
  className
}) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: "text-green-600 bg-green-50 border-green-200",
    error: "text-red-600 bg-red-50 border-red-200",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
    info: "text-blue-600 bg-blue-50 border-blue-200"
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      colors[type],
      className
    )}>
      <div className="flex items-start space-x-3">
        <Icon className="h-6 w-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && (
            <p className="text-sm mt-1 opacity-90">{description}</p>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Trophy,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      "bg-card rounded-lg border border-dashed",
      className
    )}>
      <div className="rounded-full bg-muted p-3 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
};

// Specialized empty states
export const EmptyTournaments: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon={Trophy}
    title="لا توجد بطولات"
    description="ابدأ بإنشاء أول بطولة لك"
    action={action}
  />
);

export const EmptyTeams: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon={Users}
    title="لا توجد فرق مسجلة"
    description="لم يتم تسجيل أي فرق في هذه البطولة بعد"
    action={action}
  />
);

export const EmptyMatches: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon={Calendar}
    title="لا توجد مباريات"
    description="لم يتم جدولة أي مباريات لهذا اليوم"
    action={action}
  />
);

// Success celebration component
interface SuccessCelebrationProps {
  title: string;
  description?: string;
  confetti?: boolean;
  children?: React.ReactNode;
}

export const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({
  title,
  description,
  confetti = false,
  children
}) => {
  return (
    <div className="text-center p-8">
      {confetti && (
        <div className="relative overflow-hidden rounded-lg mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 opacity-10" />
          <div className="animate-bounce">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold text-green-600 mb-2">{title}</h2>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      {children}
    </div>
  );
};