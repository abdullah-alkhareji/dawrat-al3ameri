// src/lib/schedule-full-tournament.ts

import prisma from "@/lib/prisma";
import { generateEmptyBracket } from "./generate-bracket";
import { saveBracketToDatabase } from "./save-bracket";
import { scheduleSubTournamentMatches } from "./schedule-matches";
import { Match } from "@prisma/client";

// Use this function in getNextValidTournamentDay to determine if a day is valid
function isValidTournamentDay(date: Date): boolean {
  // Get the actual day of the week (0-6, 0 being Sunday)
  const day = date.getDay();

  // Log the date and day for debugging
  console.log(`[DATE_DEBUG] Checking if date is valid:`, {
    date: date.toISOString(),
    day,
    dayName: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][day],
  });

  // Thursday (4) or Friday (5)
  return day === 4 || day === 5;
}

function getNextValidTournamentDay(date: Date, allowSaturday = false): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);

  console.log(
    `[DATE_DEBUG] Finding next valid day after ${date.toISOString()}`
  );

  while (true) {
    const day = next.getDay();
    const isValid = isValidTournamentDay(next) || (allowSaturday && day === 6);
    if (isValid) {
      console.log(`[DATE_DEBUG] Found valid day:`, {
        date: next.toISOString(),
        day,
        dayName: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][day],
      });
      break;
    }
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
  console.log(`[TOURNAMENT_SCHEDULING] Starting with params:`, {
    tournamentId,
    teamCount,
    startDate: startDate.toISOString(),
    tableCount,
    timeSlots,
  });

  // ✅ Allow any power of 2 (2–32) without needing to divide by 32
  if (teamCount > 32 && teamCount % 32 !== 0) {
    throw new Error("Team count above 32 must be divisible by 32");
  }

  // Check if startDate is a valid Date object
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    console.error(`[TOURNAMENT_SCHEDULING] Invalid startDate:`, startDate);
    throw new Error("Invalid start date provided");
  }

  // Ensure we're using a consistent date
  const startDateCopy = new Date(startDate);

  // ✅ Small tournaments (2–32 teams)
  if (teamCount <= 32) {
    console.log(
      `[TOURNAMENT_SCHEDULING] Processing small tournament (${teamCount} teams)`
    );
    const groupCode = "Day1-A";
    const bracket = generateEmptyBracket(teamCount);
    await saveBracketToDatabase(tournamentId, bracket, groupCode);

    const matches = await prisma.match.findMany({
      where: { tournamentId, groupCode },
      orderBy: [{ round: "desc" }, { matchNumber: "asc" }],
    });
    console.log(
      `[TOURNAMENT_SCHEDULING] Found ${matches.length} matches to schedule`
    );

    const scheduled = scheduleSubTournamentMatches({
      matches,
      startDate: startDateCopy,
      timeSlots,
      tableCount,
    });
    console.log(
      `[TOURNAMENT_SCHEDULING] Scheduled ${scheduled.length} matches`
    );

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

    console.log("✅ Small tournament scheduled.");
    return;
  }

  // ✅ Large tournaments (teamCount > 32)
  console.log(
    `[TOURNAMENT_SCHEDULING] Processing large tournament (${teamCount} teams)`
  );
  const totalGroups = teamCount / 32;

  let currentDay = new Date(startDateCopy);
  let groupPerDay = 0;
  let dayCounter = 1;
  let groupCodeLetter = "A";
  let dayMatches: Match[] = [];
  let lastUsedDay = currentDay;

  console.log(
    `[TOURNAMENT_SCHEDULING] Large tournament initial currentDay:`,
    currentDay.toISOString()
  );

  // Always use the startDate for the first day, regardless of day of week
  // This ensures consistent behavior in both environments
  for (let g = 0; g < totalGroups; g++) {
    if (groupPerDay === 0) {
      if (g === 0) {
        // For the first group, use the startDate directly
        console.log(
          `[TOURNAMENT_SCHEDULING] Using provided start date for first day:`,
          currentDay.toISOString()
        );
      } else {
        // For subsequent groups, find a valid day
        currentDay = getNextValidTournamentDay(lastUsedDay);
        console.log(
          `[TOURNAMENT_SCHEDULING] Using tournament day:`,
          currentDay.toISOString()
        );
      }
    }

    const groupCode = `Day${dayCounter}-${groupCodeLetter}`;
    console.log(`[TOURNAMENT_SCHEDULING] Creating group: ${groupCode}`);
    const bracket = generateEmptyBracket(32);
    await saveBracketToDatabase(tournamentId, bracket, groupCode);

    const matches = await prisma.match.findMany({
      where: { tournamentId, groupCode },
      orderBy: [{ round: "desc" }, { matchNumber: "asc" }],
    });
    console.log(
      `[TOURNAMENT_SCHEDULING] Found ${matches.length} matches for group ${groupCode}`
    );

    dayMatches.push(...matches);

    groupPerDay++;
    groupCodeLetter = String.fromCharCode(groupCodeLetter.charCodeAt(0) + 1);

    const isLastGroup = g === totalGroups - 1;

    if (groupPerDay === 2 || isLastGroup) {
      console.log(
        `[TOURNAMENT_SCHEDULING] Scheduling day ${dayCounter} with ${dayMatches.length} matches`
      );
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
      currentDay = getNextValidTournamentDay(lastUsedDay); // now safe to increment
      dayMatches = [];
    }
  }

  // ✅ Create Grand Finals if needed
  if (totalGroups > 1) {
    console.log(
      `[TOURNAMENT_SCHEDULING] Creating Grand Finals bracket for ${totalGroups} groups`
    );
    const finalBracket = generateEmptyBracket(totalGroups);
    const finalGroupCode = "Finals";
    await saveBracketToDatabase(tournamentId, finalBracket, finalGroupCode);

    const finalMatches = await prisma.match.findMany({
      where: { tournamentId, groupCode: finalGroupCode },
      orderBy: [{ round: "desc" }, { matchNumber: "asc" }],
    });
    console.log(
      `[TOURNAMENT_SCHEDULING] Found ${finalMatches.length} matches for finals`
    );

    // ✅ Force finals to Saturday (even if it's not the immediate next day)
    const finalDay = getNextValidTournamentDay(lastUsedDay, true); // Saturday is allowed
    console.log(
      `[TOURNAMENT_SCHEDULING] Finals day set to:`,
      finalDay.toISOString()
    );

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

  console.log(`[TOURNAMENT_SCHEDULING] Tournament scheduling complete`);
}
