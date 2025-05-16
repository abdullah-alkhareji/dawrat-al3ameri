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
    <div className="container mx-auto space-y-6">
      {/* Welcome Header Section */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-2 border-b">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            هلا {session.user?.name}
          </h1>
          <p className="text-muted-foreground mt-1">ولكم بالك</p>
        </div>
        <div className="flex items-center gap-3"></div>
      </section>

      {/* Dashboard Content */}
      {/* Main Tournament List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">البطولات المتاحة</h2>
          </div>
        </div>
        <TournamentList />
      </div>
    </div>
  );
};

export default DashboardPage;
