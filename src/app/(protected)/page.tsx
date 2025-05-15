import React from "react";
import TournamentList from "@/components/tournament-list";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="h-full flex flex-col gap-4">
        <TournamentList />
      </div>
    </>
  );
};

export default DashboardPage;
