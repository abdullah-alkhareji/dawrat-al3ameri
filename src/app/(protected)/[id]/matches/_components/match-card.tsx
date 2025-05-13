import React from "react";
import { Match, Team } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";

type MatchCardProps = {
  match: Match & { team1: Team | null; team2: Team | null };
  round: number;
};

const MatchCard = ({ match, round }: MatchCardProps) => {
  console.log({ match });
  return (
    <div className="bg-card p-4 rounded-lg border border-border flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground flex items-center gap-2 font-bold">
          <span className="size-10 p-2 inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full px-2">
            {match.matchNumber}
          </span>
          <div className="flex flex-col gap-1">
            <span>
              {match.round === 1
                ? "النهائي"
                : match.round === 2
                ? "نص النهائي"
                : match.round === 3
                ? "ربع النهائي"
                : `الجولة ${round}`}
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
        <p className="inline-flex items-center justify-center bg-muted text-muted-foreground rounded-full  p-10 h-10 w-10 text-4xl overflow-hidden whitespace-nowrap font-bold">
          {match.team1?.teamNumber ? match.team1.teamNumber : "-"}
        </p>
        <X className="size-10 text-primary" />
        <p className="inline-flex items-center justify-center bg-muted text-muted-foreground rounded-full p-10 h-10 w-10 text-4xl overflow-hidden whitespace-nowrap font-bold">
          {match.team2?.teamNumber ? match.team2.teamNumber : "-"}
        </p>
      </div>
    </div>
  );
};

export default MatchCard;
