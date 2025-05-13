import prisma from "@/lib/prisma";

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
