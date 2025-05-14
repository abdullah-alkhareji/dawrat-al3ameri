// src/lib/save-bracket.ts

import prisma from "./prisma";
import { PartialMatch } from "./types";

export async function saveBracketToDatabase(
  tournamentId: string,
  bracket: PartialMatch[][],
  groupCode: string
): Promise<void> {
  const flatMatches: PartialMatch[] = bracket.flat().map((match) => ({
    ...match,
    tournamentId,
    groupCode,
    startTime: null,
    tableNumber: null,
    matchDate: match.matchDate ?? new Date(), // placeholder
  }));

  await prisma.match.createMany({
    data: flatMatches,
    skipDuplicates: true,
  });
}
