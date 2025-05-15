// src/app/(protected)/[id]/matches/page.tsx

import React from "react";
import TournamentInfo from "../_components/tournament-info";
import { redirect } from "next/navigation";
import { getTournament } from "@/actions/tournament";
import { getMatchesByTournamentId } from "@/actions/matches";
import MatchesList from "./_components/matches-list";

type MatchesPageProps = {
  params: Promise<{ id: string }>;
};

const MatchesPage = async ({ params }: MatchesPageProps) => {
  const { id } = await params;
  if (!id) {
    redirect("/");
  }
  const { data: tournament, error: tournamentError } = await getTournament(id);
  const { data: matches, error } = await getMatchesByTournamentId(id);

  console.log({ matches });

  if (error || tournamentError) {
    redirect("/");
  }

  if (!matches || !tournament) {
    redirect("/");
  }

  if (matches.length === 0) {
    return (
      <div className="space-y-4">
        <TournamentInfo tournament={tournament} id={id} />
        <p className="text-muted-foreground">لا يوجد مباريات</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TournamentInfo tournament={tournament} id={id} />
      <MatchesList matches={matches} />
    </div>
  );
};

export default MatchesPage;
