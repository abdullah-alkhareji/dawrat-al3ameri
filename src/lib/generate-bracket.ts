// src/lib/generate-bracket.ts

import { PartialMatch } from "./types";

function generateEmptyBracket(teamCount: number): PartialMatch[][] {
  if ((teamCount & (teamCount - 1)) !== 0) {
    throw new Error("Team count must be a power of 2");
  }

  const totalRounds = Math.log2(teamCount);
  const bracket: PartialMatch[][] = [];

  let matchCount = teamCount / 2;

  for (let r = 1; r <= totalRounds; r++) {
    const round: PartialMatch[] = [];
    for (let m = 0; m < matchCount; m++) {
      round.push({
        round: r,
        matchNumber: m + 1,
        team1Id: null,
        team2Id: null,
        winnerId: null,
        startTime: null,
        tableNumber: null,
        groupCode: null,
        matchDate: new Date(0),
        tournamentId: "",
      });
    }
    bracket.push(round);
    matchCount /= 2;
  }

  return bracket;
}

export { generateEmptyBracket };
