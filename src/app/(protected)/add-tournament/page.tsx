import AddTournamentForm from "@/components/tournament/add-tournament-form";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

const AddTournamentPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">دورة يديدة 🆕</h1>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeftIcon className="size-6" />
          </Link>
        </Button>
      </div>
      <AddTournamentForm />
    </div>
  );
};

export default AddTournamentPage;
