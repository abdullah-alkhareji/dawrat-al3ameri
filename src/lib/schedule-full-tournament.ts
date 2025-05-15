// src/lib/schedule-full-tournament.ts

import prisma from "@/lib/prisma";
import { generateEmptyBracket } from "./generate-bracket";
import { saveBracketToDatabase } from "./save-bracket";
import { scheduleSubTournamentMatches } from "./schedule-matches";
import { Match } from "@prisma/client";

function isValidTournamentDay(date: Date): boolean {
  const day = date.getDay();
  return day === 4 || day === 5;
}

function getNextValidTournamentDay(date: Date, allowSaturday = false): Date {
  const next = new Date(date);
  next.setDate(date.getDate() + 1);
  while (true) {
    const day = next.getDay();
    if (day === 4 || day === 5 || (allowSaturday && day === 6)) break;
    next.setDate(next.getDate() + 1);
  }
  return next;
}

export async function scheduleFullTournament({
  tournamentId,
  teamCount,
  startDate,
  tableCount = 16,
  timeSlots = ["18:00", "19:30", "21:00", "22:30", "00:00", "01:30"],
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
  let dayMatches: Match[] = [];

  let lastUsedDay = currentDay;

  for (let g = 0; g < totalGroups; g++) {
    if (groupPerDay === 0) {
      currentDay = isValidTournamentDay(currentDay)
        ? currentDay
        : getNextValidTournamentDay(currentDay);
    }

    const groupCode = `Day${dayCounter}-${groupCodeLetter}`;
    const bracket = generateEmptyBracket(32);
    await saveBracketToDatabase(tournamentId, bracket, groupCode);

    const matches = await prisma.match.findMany({
      where: { tournamentId, groupCode },
      orderBy: [{ round: "desc" }, { matchNumber: "asc" }],
    });

    dayMatches.push(...matches);

    groupPerDay++;
    groupCodeLetter = String.fromCharCode(groupCodeLetter.charCodeAt(0) + 1);

    const isLastGroup = g === totalGroups - 1;

    if (groupPerDay === 2 || isLastGroup) {
      const scheduled = scheduleSubTournamentMatches({
        matches: dayMatches,
        startDate: currentDay,
        timeSlots,
        tableCount,
      });

      await prisma.$transaction(
        scheduled.map((match) =>
          prisma.match.update({
            where: { id: match.id },
            data: {
              startTime: match.startTime,
              matchDate: match.matchDate,
              tableNumber: match.tableNumber,
            },
          })
        )
      );

      lastUsedDay = currentDay;

      groupPerDay = 0;
      groupCodeLetter = "A";
      dayCounter++;
      currentDay = getNextValidTournamentDay(currentDay); // now safe to increment
      dayMatches = [];
    }
  }

  // ✅ Create Grand Finals if needed
  if (totalGroups > 1) {
    const finalBracket = generateEmptyBracket(totalGroups);
    const finalGroupCode = "Finals";
    await saveBracketToDatabase(tournamentId, finalBracket, finalGroupCode);

    const finalMatches = await prisma.match.findMany({
      where: { tournamentId, groupCode: finalGroupCode },
      orderBy: [{ round: "desc" }, { matchNumber: "asc" }],
    });

    // ✅ Force finals to Saturday (even if it's not the immediate next day)
    const finalDay = getNextValidTournamentDay(lastUsedDay, true); // Saturday is allowed

    const scheduledFinals = scheduleSubTournamentMatches({
      matches: finalMatches,
      startDate: finalDay,
      timeSlots,
      tableCount,
    });

    await prisma.$transaction(
      scheduledFinals.map((match) =>
        prisma.match.update({
          where: { id: match.id },
          data: {
            startTime: match.startTime,
            matchDate: match.matchDate,
            tableNumber: match.tableNumber,
          },
        })
      )
    );
  }
}
