import { useState, useEffect, useCallback } from "react";
import { getTeam } from "@/actions/teams";
import { Team, Tournament } from "@prisma/client";

type UseTeamResult = {
  team: (Team & { tournament: Tournament }) | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useTeam(teamId: string): UseTeamResult {
  const [team, setTeam] = useState<(Team & { tournament: Tournament }) | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError, success } = await getTeam(teamId);

      if (!success || fetchError) {
        setError(fetchError || "Failed to fetch team");
        return;
      }

      setTeam(data || null);
    } catch (error: unknown) {
      console.error("[useTeam]", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      fetchTeam();
    }
  }, [teamId, fetchTeam]);

  return {
    team,
    isLoading,
    error,
    refetch: fetchTeam,
  };
}
