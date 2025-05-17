// src/app/(protected)/[id]/matches/_components/match-card.tsx

"use client";

import React, { useTransition } from "react";
import { Match, Team } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trophy, X } from "lucide-react";
import { markWinner } from "@/actions/matches"; // ✅ import server action
import { cn, formatMatchRound } from "@/lib/utils";

type MatchCardProps = {
  match: Match & {
    team1: Team | null;
    team2: Team | null;
    winner: Team | null;
  };
};

const MatchCard = ({ match }: MatchCardProps) => {
  const [isPending, startTransition] = useTransition();

  const team1IsWinner = match.winnerId === match.team1?.id;
  const team2IsWinner = match.winnerId === match.team2?.id;

  const handleWinner = (teamId: string) => {
    startTransition(async () => {
      await markWinner(match.id, teamId, match.tournamentId);
    });
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="text-sm flex items-center gap-2 font-bold">
          <span className="size-10 p-2 inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full">
            {match.matchNumber}
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-primary">
              {formatMatchRound(match.round)}
            </span>
            <span className="text-xs text-muted-foreground">
              {match.matchDate.toLocaleString("ar-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Pencil className="size-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        {/* Team 1 */}
        <div
          className={cn(
            "flex flex-col gap-2 items-center transition-all duration-300",
            team1IsWinner && "scale-110"
          )}
        >
          <div
            className={cn(
              "inline-flex items-center justify-center bg-muted rounded-full p-10 h-14 w-14 text-3xl font-bold transition-all duration-300",
              team1IsWinner &&
                "bg-yellow-100 text-yellow-800 border-2 border-yellow-400"
            )}
          >
            {match.team1?.teamNumber ?? "-"}
            {team1IsWinner && (
              <Trophy className="absolute -top-2 -right-2 h-5 w-5 text-yellow-500" />
            )}
          </div>
          {match.team1 && !match.winnerId && (
            <Button
              variant="secondary"
              size="sm"
              disabled={isPending}
              onClick={() => handleWinner(match.team1!.id)}
              className="mt-2"
            >
              الفريق {match.team1.teamNumber} فاز
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center">
          <X className="size-8 text-primary mb-1" />
          <span className="text-xs text-muted-foreground">vs</span>
        </div>

        {/* Team 2 */}
        <div
          className={cn(
            "flex flex-col gap-2 items-center transition-all duration-300",
            team2IsWinner && "scale-110"
          )}
        >
          <div
            className={cn(
              "inline-flex items-center justify-center bg-muted rounded-full p-10 h-14 w-14 text-3xl font-bold transition-all duration-300 relative",
              team2IsWinner &&
                "bg-yellow-100 text-yellow-800 border-2 border-yellow-400"
            )}
          >
            {match.team2?.teamNumber ?? "-"}
            {team2IsWinner && (
              <Trophy className="absolute -top-2 -right-2 h-5 w-5 text-yellow-500" />
            )}
          </div>
          {match.team2 && !match.winnerId && (
            <Button
              variant="secondary"
              size="sm"
              disabled={isPending}
              onClick={() => handleWinner(match.team2!.id)}
              className="mt-2"
            >
              الفريق {match.team2.teamNumber} فاز
            </Button>
          )}
        </div>
      </div>

      {match.winnerId && (
        <div className="text-center text-sm font-medium bg-green-50 text-green-700 py-2 rounded-md border border-green-200">
          تم تحديد الفريق الفائز:{" "}
          <span className="font-bold">
            {match.winnerId === match.team1?.id
              ? match.team1.teamNumber
              : match.team2?.teamNumber}
          </span>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
