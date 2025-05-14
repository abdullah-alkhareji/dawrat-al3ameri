// src/lib/schedule-full-tournament.ts

import prisma from "@/lib/prisma";
import { generateEmptyBracket } from "./generate-bracket";
import { saveBracketToDatabase } from "./save-bracket";
import { scheduleSubTournamentMatches } from "./schedule-matches";  
import { Match } from "@prisma/client";

function isValidTournamentDay(date: Date): boolean {
  const day = date.getDay();
  return day === 4 || day === 5; // Thursday or Friday
}

function getNextValidTournamentDay(date: Date): Date {
  const next = new Date(date);
  next.setDate(date.getDate() + 1);
  while (!isValidTournamentDay(next)) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

export async function scheduleFullTournament({
  tournamentId,
  teamCount,
  startDate,
  tableCount = 16,
  timeSlots = ["18:00", "19:30", "21:00", "22:30", "00:00"],
}: {
  tournamentId: string;
  teamCount: number;
  startDate: Date;
  tableCount?: number;
  timeSlots?: string[];
}): Promise<void> {
  const totalGroups = teamCount / 32;
  if (totalGroups % 1 !== 0) {
    throw new Error("Team count must be divisible by 32");
  }

  let currentDay = new Date(startDate);
  let groupPerDay = 0;
  let dayCounter = 1;
  let groupCodeLetter = "A";

  for (let g = 0; g < totalGroups; g++) {
    if (groupPerDay >= 2) {
      currentDay = getNextValidTournamentDay(currentDay);
      groupPerDay = 0;
      dayCounter++;
      groupCodeLetter = "A";
    }

    const groupCode = `Day${dayCounter}-${groupCodeLetter}`;
    const bracket = generateEmptyBracket(32);

    await saveBracketToDatabase(tournamentId, bracket, groupCode);

    const matches = await prisma.match.findMany({
      where: { tournamentId, groupCode },
      orderBy: { round: "asc" },
    });

    const scheduledMatches = scheduleSubTournamentMatches({
      matches,
      startDate: currentDay,
      tableCount,
      timeSlots,
    });

    await Promise.all(
      scheduledMatches.map((match: Match) =>
        prisma.match.update({
          where: { id: match.id },
          data: {
            startTime: match.startTime,
            tableNumber: match.tableNumber,
            matchDate: match.matchDate,
          },
        })
      )
    );

    groupPerDay++;
    groupCodeLetter = String.fromCharCode(groupCodeLetter.charCodeAt(0) + 1); // A → B → C ...
  }
}
