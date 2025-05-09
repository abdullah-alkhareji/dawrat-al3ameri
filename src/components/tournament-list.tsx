import React from "react";
import { getTournaments } from "@/actions/tournament";
import { Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";

const TournamentList = async () => {
  const { data: tournaments, error } = await getTournaments();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">البطولات</h1>
      {tournaments?.map((tournament) => (
        <Link href={`/${tournament.id}`} key={tournament.id}>
          <div className="flex items-center justify-between gap-2 bg-card rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-2">
                <p className="text-lg font-bold">{tournament.name}</p>
                <p className="text-xs flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4" />
                  مـن {tournament.startDate.toLocaleDateString()}
                </p>
                <p className="text-xs flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4" />
                  لـي {tournament.endDate.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChevronLeft className="size-4" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TournamentList;
