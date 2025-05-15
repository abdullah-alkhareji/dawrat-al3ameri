// src/lib/propagate-winner.ts

import prisma from "@/lib/prisma";

export const propagateWinner = async (matchId: string): Promise<void> => {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      round: true,
      matchNumber: true,
      groupCode: true,
      winnerId: true,
      tournamentId: true,
    },
  });

  if (!match || !match.winnerId) {
    console.warn("[PROPAGATE] Match not found or has no winner.");
    return;
  }

  const nextRound = match.round - 1;
  if (nextRound < 1) {
    // This was the final round — no propagation needed
    return;
  }

  const nextMatchNumber = Math.floor((match.matchNumber - 1) / 2) + 1;

  const nextMatch = await prisma.match.findFirst({
    where: {
      tournamentId: match.tournamentId,
      groupCode: match.groupCode,
      round: nextRound,
      matchNumber: nextMatchNumber,
    },
    select: {
      id: true,
      team1Id: true,
      team2Id: true,
    },
  });

  if (!nextMatch) {
    console.warn("[PROPAGATE] Next round match not found.");
    return;
  }

  const slotToFill = !nextMatch.team1Id ? "team1Id" : !nextMatch.team2Id ? "team2Id" : null;

  if (!slotToFill) {
    console.warn("[PROPAGATE] Next match already full.");
    return;
  }

  await prisma.match.update({
    where: { id: nextMatch.id },
    data: {
      [slotToFill]: match.winnerId,
    },
  });
};
