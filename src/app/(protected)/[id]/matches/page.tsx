// src/app/(protected)/[id]/matches/page.tsx

import React from "react";
import TournamentInfo from "../_components/tournament-info";
import { redirect } from "next/navigation";
import { getTournament } from "@/actions/tournament";
import { getMatchesByTournamentId } from "@/actions/matches";
import MatchesList from "./_components/matches-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardPenLine } from "lucide-react";
import EmptyState from "./_components/empty-state";

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

  if (error || tournamentError) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xl text-red-600">خطأ</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-red-500">{error || tournamentError}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tournament) {
    redirect("/");
  }

  return (
    <div className="w-full mx-auto max-w-screen-2xl flex flex-col gap-6">
      <TournamentInfo tournament={tournament} id={id} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardPenLine className="size-5 text-primary" />
            مباريات البطولة
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-4 py-0">
          {!matches || matches.length === 0 ? (
            <EmptyState tournamentId={id} />
          ) : (
            <MatchesList matches={matches} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchesPage;
