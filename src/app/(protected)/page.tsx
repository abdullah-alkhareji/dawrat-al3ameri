import React from "react";
import TournamentList from "@/components/tournament-list";
const DashboardPage = () => {
  return (
    <>
      <div className="h-full flex flex-col gap-4">
        <TournamentList />
      </div>
    </>
  );
};

export default DashboardPage;
