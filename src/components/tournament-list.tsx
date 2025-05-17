import React from "react";
import { getTournaments } from "@/actions/tournament";
import { CalendarX } from "lucide-react";
import TournamentCard from "./tournament-card";
import { Card, CardContent } from "@/components/ui/card";

const TournamentList = async () => {
  const { data: tournaments, error } = await getTournaments();

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="p-4 text-destructive">
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <CalendarX className="size-12 text-muted-foreground mb-3 opacity-20" />
          <h3 className="text-lg font-medium text-muted-foreground text-center">
            لا توجد بطولات متاحة حالياً
          </h3>
          <p className="text-muted-foreground text-center text-sm mt-1">
            سيتم إضافة بطولات جديدة قريباً
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
};

export default TournamentList;
