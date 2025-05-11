import React from "react";
import { getTournaments } from "@/actions/tournament";
import { Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";

const TournamentList = async () => {
  const { data: tournaments, error } = await getTournaments();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">البطولات</h1>
      {tournaments?.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">ماكو بطولات</p>
        </div>
      )}
      {tournaments?.map((tournament) => (
        <Link href={`/${tournament.id}`} key={tournament.id}>
          <div className="flex items-center justify-between gap-2 bg-card rounded-lg p-4 border border-muted">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">{tournament.name}</p>
                  {tournament.teams?.length >= tournament.teamCount && (
                    <Badge>فولت</Badge>
                  )}
                  {new Date() > tournament.lastRegDate &&
                    new Date() < tournament.endDate && (
                      <Badge>انتهى التسجيل</Badge>
                    )}
                  {new Date() < tournament.startDate &&
                    new Date() > tournament.endDate && <Badge>بلشت</Badge>}
                  {new Date() > tournament.endDate && <Badge>خلصت</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-4 text-primary" />
                    مـن {tournament.startDate.toLocaleDateString()}
                  </p>
                  <span className="text-muted-foreground">-</span>
                  <p className="text-xs flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-4 text-primary" />
                    لـي {tournament.endDate.toLocaleDateString()}
                  </p>
                </div>
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
