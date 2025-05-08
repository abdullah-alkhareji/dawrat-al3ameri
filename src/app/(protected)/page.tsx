import React from "react";
// import AddTournamentModal from "@/components/tournament/add-tournament-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="relative h-full flex flex-col gap-4">
      {/* <AddTournamentModal /> */}
      <Button
        variant="default"
        className="fixed bottom-4 right-4 size-16 rounded-full hidden lg:flex"
        asChild
      >
        <Link href="/add-tournament">
          <Plus className="size-6" />
        </Link>
      </Button>
    </div>
  );
};

export default DashboardPage;
