import React from "react";
import { getTournaments } from "@/actions/tournament";
import { Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="w-full flex flex-col gap-4">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
};

export const TournamentListSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card rounded-lg p-4 border border-muted"
        >
          <div className="flex items-start md:items-center gap-3">
            <Skeleton className="hidden md:block size-12 rounded-full" />
            <div className="flex flex-col gap-1 w-full">
              <Skeleton className="h-6 w-48" />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <Skeleton className="size-8 rounded-full self-end md:self-center ml-auto" />
        </div>
      ))}
    </div>
  );
};

export default TournamentList;
