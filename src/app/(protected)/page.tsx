import React from "react";
import TournamentList from "@/components/tournament-list";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Trophy } from "lucide-react";

const DashboardPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full mx-auto max-w-screen-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="bg-primary/5 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">هلا {session.user?.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">ولكم بالك</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tournament List Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">البطولات المتاحة</h2>
          </div>
        </div>
        <TournamentList />
      </div>
    </div>
  );
};

export default DashboardPage;
