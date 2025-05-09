import React from "react";
import { getTournament } from "@/actions/tournament";
import ApplicationForm from "@/components/forms/application-form";
import { Tournament, Team } from "@/generated/prisma";
import { Calendar } from "lucide-react";

const ApplicationPage = async ({
  searchParams,
}: {
  searchParams: { id: string };
}) => {
  const { id } = await searchParams;
  const { data: tournament, error } = (await getTournament(id)) as {
    data: (Tournament & { teams: Team[] }) | null;
    error?: string;
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!tournament) {
    return <div>البطولة غير موجودة</div>;
  }

  return (
    <div className="w-full h-screen max-w-screen-2xl mx-auto">
      {tournament?.lastRegDate && tournament?.lastRegDate < new Date() ? (
        <div className="text-center text-2xl font-bold flex flex-col items-center justify-center h-full">
          معلش, انتهى التسجيل
        </div>
      ) : tournament?.teams?.length >= tournament?.teamCount ? (
        <div className="text-center text-2xl font-bold flex flex-col items-center justify-center h-full">
          معلش, فولت البطولة
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* <h1 className="text-2xl font-black">تسجيل في بطولة</h1> */}
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

          <ApplicationForm teamsCount={tournament?.teams?.length || 0} />
        </div>
      )}
    </div>
  );
};

export default ApplicationPage;
