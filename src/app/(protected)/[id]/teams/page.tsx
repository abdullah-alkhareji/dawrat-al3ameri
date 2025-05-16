import { getTeamByTournamentId } from "@/actions/teams";
import { getTournament } from "@/actions/tournament";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_columns";
import TournamentInfo from "../_components/tournament-info";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  if (!teams || !tournament) {
    redirect("/");
  }

  return (
    <div className="w-full mx-auto max-w-screen-2xl flex flex-col gap-6">
      <TournamentInfo tournament={tournament} id={id} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            الفرق المسجلة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={teams}
            filterKey="teamNumber"
            placeholder="رقم الفريق"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsPage;
