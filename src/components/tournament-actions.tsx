"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function TournamentActions() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTournament = () => {
    setIsLoading(true);
    router.push("/add-tournament");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <Button
        onClick={handleAddTournament}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        <PlusCircle className="mr-2 size-4" />
        إضافة بطولة جديدة
      </Button>
    </div>
  );
}
