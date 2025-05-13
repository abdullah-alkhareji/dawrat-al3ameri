import { getTeamByTournamentId } from "@/actions/teams";
import { getTournament } from "@/actions/tournament";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_columns";
import TournamentInfo from "../_components/tournament-info";

type TeamsPageProps = {
  params: Promise<{ id: string }>;
};

const TeamsPage = async ({ params }: TeamsPageProps) => {
  const { id } = await params;
  if (!id) {
    redirect("/");
  }
  const { data: tournament, error: tournamentError } = await getTournament(id);
  const { data: teams, error } = await getTeamByTournamentId(id);

  if (error || tournamentError) {
    redirect("/");
  }

  if (!teams || !tournament) {
    redirect("/");
  }

  return (
    <div className="space-y-4">
      <TournamentInfo tournament={tournament} id={id} />
      <div className="flex flex-col gap-2 col-span-1 bg-card p-4 rounded-lg">
        <DataTable
          columns={columns}
          data={teams}
          filterKey="teamNumber"
          placeholder="رقم الفريق"
        />
      </div>
    </div>
  );
};

export default TeamsPage;
