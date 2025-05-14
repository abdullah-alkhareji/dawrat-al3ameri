// src/app/(public)/apply/page.tsx

import React from "react";
import { getTournament } from "@/actions/tournament";
import ApplicationForm from "@/components/forms/application-form";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { Team, Tournament } from "@prisma/client";

type ApplicationPageProps = {
  searchParams: Promise<{ id: string }>;
};

const ApplicationPage = async ({ searchParams }: ApplicationPageProps) => {
  const { id } = await searchParams;

  if (!id) {
    redirect("/");
  }

  const { data: tournament, error } = (await getTournament(id)) as {
    data: (Tournament & { teams: Team[] }) | null;
    error?: string;
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!tournament) {
    return (
      <div className="text-center text-2xl font-bold flex flex-col items-center justify-center h-full">
        البطولة مو موجودة
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto">
      {tournament?.lastRegDate && tournament?.lastRegDate < new Date() ? (
        <div className="text-center text-2xl font-bold flex flex-col items-center justify-center h-full">
          معلش, انتهى التسجيل
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold text-foreground">
              {tournament?.name}
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

          <ApplicationForm
            teamsCount={tournament?.teams?.length || 0}
            tournamentId={tournament.id}
          />
        </div>
      )}
    </div>
  );
};

export default ApplicationPage;
