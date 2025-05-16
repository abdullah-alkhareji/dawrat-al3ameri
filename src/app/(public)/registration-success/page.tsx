// src/app/(public)/registration-success/page.tsx

import React from "react";
import { getTeam } from "@/actions/teams";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedRegistrationSuccess from "./animated-success";
import { TeamWithMatches } from "@/lib/types";

type RegistrationSuccessPageProps = {
  searchParams: Promise<{ id: string }>;
};

const RegistrationSuccessPage = async ({
  searchParams,
}: RegistrationSuccessPageProps) => {
  const { id } = await searchParams;

  if (!id) {
    redirect("/");
  }

  const { data: team, error } = await getTeam(id);

  if (error || !team) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Card className="w-full max-w-md shadow-lg border-neutral-200 dark:border-neutral-800">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <svg
                  className="h-8 w-8 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">مضيع يالحبيب؟</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {error || "الفريق مو موجود"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reviewUrl = `${baseUrl}/review?id=${team.id}`;

  // Use the client component with animations
  return (
    <AnimatedRegistrationSuccess
      team={team as TeamWithMatches}
      reviewUrl={reviewUrl}
    />
  );
};

export default RegistrationSuccessPage;
