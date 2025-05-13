import { getTeamByTournamentId } from "@/actions/teams";
import { getTournament } from "@/actions/tournament";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_columns";

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
      <div className="flex flex-col gap-2 col-span-1 bg-card p-4 rounded-lg">
        <h1 className="text-xl font-bold">البطولة</h1>
        <p className="text-foreground ">
          اسم البطولة:{" "}
          <span className="text-muted-foreground">{tournament?.name}</span>
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            {tournament?.startDate.toLocaleDateString()}
          </p>
          <span className="text-muted-foreground">-</span>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            {tournament?.endDate.toLocaleDateString()}
          </p>
        </div>
      </div>
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
