import React from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, Trophy, Users, MapPin } from "lucide-react";
import { Tournament, Team } from "@prisma/client";

interface TournamentCardProps {
  tournament: Tournament & {
    teams?: Team[];
  };
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  return (
    <Link href={`/${tournament.id}`} className="group">
      <div className="w-full flex items-center justify-between gap-3 bg-card hover:bg-card/80 rounded-lg p-4 border border-muted transition-all duration-200 hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="hidden md:flex size-12 rounded-full bg-primary/10 items-center justify-center">
            <Trophy className="size-6 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
              {tournament.name}
            </h3>
            <div className="flex flex-col lg:flex-row items-start justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-1">
                <Calendar className="size-3.5 text-primary" />
                {tournament.startDate.toLocaleDateString()}
              </p>
              {tournament.location && (
                <p className="flex items-center justify-start gap-1">
                  <MapPin className="size-3.5 text-primary" />
                  <span className="overflow-clip max-w-40 text-ellipsis">
                    {tournament.location}
                  </span>
                </p>
              )}
              {tournament.teamCount && (
                <p className="flex items-center gap-1">
                  <Users className="size-3.5 text-primary" />
                  {tournament.teamCount} فريق
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-200">
          <ChevronLeft className="size-4 text-primary group-hover:text-white" />
        </div>
      </div>
    </Link>
  );
};

export default TournamentCard;
