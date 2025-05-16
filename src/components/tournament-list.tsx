import React from "react";
import { getTournaments } from "@/actions/tournament";
import { Trophy } from "lucide-react";
import TournamentCard from "./tournament-card";

const TournamentList = async () => {
  const { data: tournaments, error } = await getTournaments();

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
        <p>{error}</p>
      </div>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
        <Trophy className="size-12 text-muted-foreground mb-2 opacity-20" />
        <p className="text-muted-foreground text-center">
          لا توجد بطولات متاحة حالياً
        </p>
        <p className="text-muted-foreground text-center text-sm mt-1">
          سيتم إضافة بطولات جديدة قريباً
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:grid lg:grid-cols-3 gap-4">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
};

export default TournamentList;
