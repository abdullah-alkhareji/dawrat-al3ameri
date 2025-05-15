// src/components/dashboard/tournament-stats.tsx

import React from "react";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Match, Team } from "@prisma/client";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-card rounded-lg border p-4 hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center text-xs",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              <TrendingUp
                className={cn(
                  "h-3 w-3 mr-1",
                  !trend.isPositive && "rotate-180"
                )}
              />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TournamentStatsProps {
  tournament: {
    id: string;
    name: string;
    teamCount: number;
    teams: Team[];
    matches: Match[];
    startDate: Date;
    endDate: Date;
    location?: string;
  };
  className?: string;
}

export const TournamentStats: React.FC<TournamentStatsProps> = ({
  tournament,
  className,
}) => {
  const registeredTeams = tournament.teams.length;
  const registrationProgress = (registeredTeams / tournament.teamCount) * 100;

  const completedMatches = tournament.matches.filter((m) => m.winnerId).length;
  const totalMatches = tournament.matches.length;
  const matchProgress =
    totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

  const daysUntilStart = Math.ceil(
    (tournament.startDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const stats = [
    {
      label: "الفرق المسجلة",
      value: `${registeredTeams}/${tournament.teamCount}`,
      icon: Users,
      description: `${registrationProgress.toFixed(0)}% مكتمل`,
      trend: registeredTeams > 0 ? { value: 12, isPositive: true } : undefined,
    },
    {
      label: "المباريات المكتملة",
      value: `${completedMatches}/${totalMatches}`,
      icon: Trophy,
      description: `${matchProgress.toFixed(0)}% مكتمل`,
      trend: completedMatches > 0 ? { value: 8, isPositive: true } : undefined,
    },
    {
      label: "أيام للبداية",
      value: daysUntilStart > 0 ? daysUntilStart : "بدأت",
      icon: Calendar,
      description: tournament.startDate.toLocaleDateString("ar-SA"),
    },
    {
      label: "مدة البطولة",
      value: `${Math.ceil(
        (tournament.endDate.getTime() - tournament.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )} أيام`,
      icon: Clock,
      description: "من البداية للنهاية",
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{tournament.name}</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {tournament.location && (
            <>
              <MapPin className="h-4 w-4" />
              <span>الموقع متاح</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Progress visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold mb-3">تقدم التسجيل</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>الفرق المسجلة</span>
              <span>
                {registeredTeams}/{tournament.teamCount}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${registrationProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold mb-3">تقدم المباريات</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>المباريات المكتملة</span>
              <span>
                {completedMatches}/{totalMatches}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${matchProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
