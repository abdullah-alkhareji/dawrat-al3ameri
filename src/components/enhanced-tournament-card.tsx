// src/components/enhanced-tournament-card.tsx

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Users,
  Trophy,
  ChevronLeft,
  MapPin,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Tournament {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  lastRegDate: Date;
  teamCount: number;
  teams: { length: number };
  location?: string;
}

interface EnhancedTournamentCardProps {
  tournament: Tournament;
  className?: string;
}

const TournamentStatusBadge: React.FC<{ tournament: Tournament }> = ({
  tournament,
}) => {
  const now = new Date();
  const { startDate, endDate, lastRegDate, teams, teamCount } = tournament;

  if (teams.length >= teamCount) {
    return <Badge variant="secondary">مكتملة</Badge>;
  }

  if (now > endDate) {
    return <Badge variant="outline">انتهت</Badge>;
  }

  if (now >= startDate && now <= endDate) {
    return <Badge variant="default">قائمة</Badge>;
  }

  if (now > lastRegDate && now < startDate) {
    return <Badge variant="destructive">انتهى التسجيل</Badge>;
  }

  return <Badge variant="outline">مفتوحة للتسجيل</Badge>;
};

export const EnhancedTournamentCard: React.FC<EnhancedTournamentCardProps> = ({
  tournament,
  className,
}) => {
  const registrationProgress =
    (tournament.teams.length / tournament.teamCount) * 100;
  const daysUntilStart = Math.ceil(
    (tournament.startDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/${tournament.id}`}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-lg border bg-card",
          "transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
          "hover:border-primary/20 hover:-translate-y-1",
          className
        )}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                {tournament.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <TournamentStatusBadge tournament={tournament} />
                {tournament.location && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    متاح
                  </div>
                )}
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {tournament.teams.length}/{tournament.teamCount} فريق
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {daysUntilStart > 0 ? `${daysUntilStart} يوم` : "بدأت"}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>تقدم التسجيل</span>
              <span>{registrationProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${registrationProgress}%` }}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-2 text-primary" />
              <span>من {tournament.startDate.toLocaleDateString("ar-SA")}</span>
              <span className="mx-2">إلى</span>
              <span>{tournament.endDate.toLocaleDateString("ar-SA")}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Trophy className="h-3 w-3 mr-2 text-primary" />
              <span>
                آخر موعد تسجيل:{" "}
                {tournament.lastRegDate.toLocaleDateString("ar-SA")}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom stripe */}
        <div className="h-1 bg-gradient-to-r from-primary to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </Link>
  );
};
