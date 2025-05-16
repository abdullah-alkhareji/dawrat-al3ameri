// src/app/(protected)/[id]/_components/tournament-info.tsx

import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TournamentWithTeamsAndMatches } from "@/lib/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate, getTournamentStatus } from "@/lib/utils";

type TournamentInfoProps = {
  tournament: TournamentWithTeamsAndMatches;
  id: string;
};

const TournamentInfo = ({ tournament, id }: TournamentInfoProps) => {
  const teamsRegistered = tournament?.teams?.length || 0;
  const { status: registrationStatus, statusColor } = getTournamentStatus(
    teamsRegistered,
    tournament?.teamCount || 0
  );

  // Format date in Arabic style
  const formattedDate = formatDate(tournament?.startDate);

  return (
    <div className="bg-primary/5 rounded-lg p-4 flex items-center justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{tournament?.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {formattedDate}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Badge className={`${statusColor} text-white`}>
            {registrationStatus}
          </Badge>
          <Badge variant="outline">
            {teamsRegistered} / {tournament?.teamCount}
          </Badge>
        </div>
      </div>
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/${id}`}>
          <ArrowLeft className="size-5" />
        </Link>
      </Button>
    </div>
  );
};

export default TournamentInfo;
