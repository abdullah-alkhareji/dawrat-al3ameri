// src/actions/matches.tsx

"use server";

import prisma from "@/lib/prisma";
import { propagateWinner } from "@/lib/propagate-winner";
import { revalidatePath } from "next/cache";

export const getMatchesByTournamentId = async (tournamentId: string) => {
  try {
    const matches = await prisma.match.findMany({
      where: {
        tournamentId,
      },
      include: {
        team1: true,
        team2: true,
        winner: true,
      },
      orderBy: {
        matchNumber: "asc",
      },
    });

    return { success: true, data: matches };
  } catch (error) {
    console.error("[MATCH_GET_BY_TOURNAMENT_ID]", error);
    return { success: false, error: "في شي غلط" };
  }
};

export const markWinner = async (
  matchId: string,
  teamId: string,
  tournamentId: string
): Promise<{ success: boolean }> => {
  try {
    await prisma.match.update({
      where: { id: matchId },
      data: { winnerId: teamId },
    });

    await propagateWinner(matchId);
    revalidatePath(`/${tournamentId}/matches`);
    return { success: true };
  } catch (error) {
    console.error("[MARK_WINNER]", error);
    return { success: false };
  }
};
