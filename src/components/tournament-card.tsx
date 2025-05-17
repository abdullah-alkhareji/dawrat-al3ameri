import React from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, Trophy, Users } from "lucide-react";
import { Tournament, Team } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getTournamentStatus } from "@/lib/utils";

interface TournamentCardProps {
  tournament: Tournament & {
    teams?: Team[];
  };
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const teamsRegistered = tournament.teams?.length || 0;
  const { status: registrationStatus, statusColor } = getTournamentStatus(
    teamsRegistered,
    tournament.teamCount
  );

  // Format date using utility function
  const formattedDate = formatDate(tournament.startDate);

  return (
    <Link href={`/${tournament.id}`} className="block">
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
        <CardContent className="">
          <div className="flex justify-between items-center gap-3">
            <div className="flex flex-col gap-3 flex-grow">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="size-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{tournament.name}</h3>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formattedDate}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="size-3" />
                  {teamsRegistered} / {tournament.teamCount}
                </Badge>
                <Badge
                  className={`${statusColor} text-white flex items-center gap-1`}
                >
                  {registrationStatus}
                </Badge>
              </div>
            </div>

            <div className="shrink size-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors group">
              <ChevronLeft className="size-4 text-primary group-hover:text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TournamentCard;
