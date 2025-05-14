import prisma from "@/lib/prisma";
import { generateEmptyBracket } from "./generate-bracket";
import { saveBracketToDatabase } from "./save-bracket";
import { Match } from "@prisma/client";

function isValidTournamentDay(date: Date): boolean {
  const day = date.getDay();
  return day === 4 || day === 5 || day === 6; // Thu, Fri, Sat
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
  timeSlots = ["18:00", "19:30", "21:00", "22:30", "00:00", "01:30"],
}: {
  tournamentId: string;
  teamCount: number;
  startDate: Date;
  tableCount?: number;
  timeSlots?: string[];
}): Promise<void> {
  const totalGroups = teamCount / 32;
  if (totalGroups % 1 !== 0)
    throw new Error("Team count must be divisible by 32");

  let currentDay = new Date(startDate);
  let groupPerDay = 0;
  let dayCounter = 1;
  let groupCodeLetter = "A";

  const groupMatchMap: Record<string, Match[]> = {};
  const groupDayMap: Record<string, Date> = {};

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
      orderBy: [{ round: "desc" }, { matchNumber: "asc" }],
    });

    groupMatchMap[groupCode] = matches;
    groupDayMap[groupCode] = new Date(currentDay);

    groupPerDay++;
    groupCodeLetter = String.fromCharCode(groupCodeLetter.charCodeAt(0) + 1);
  }

  // 🧠 Schedule all groups by shared round
  const groupedByDay: Record<string, string[]> = {};
  for (const group of Object.keys(groupMatchMap)) {
    const dayKey = group.split("-")[0]; // Day1
    if (!groupedByDay[dayKey]) groupedByDay[dayKey] = [];
    groupedByDay[dayKey].push(group);
  }

  for (const dayKey in groupedByDay) {
    const groupCodes = groupedByDay[dayKey];
    const dayDate = groupDayMap[groupCodes[0]];
    const roundMap: Record<number, Match[]> = {};

    for (const groupCode of groupCodes) {
      for (const match of groupMatchMap[groupCode]) {
        roundMap[match.round] ||= [];
        roundMap[match.round].push(match);
      }
    }

    const roundNumbers = Object.keys(roundMap)
      .map(Number)
      .sort((a, b) => b - a);
    let slotIndex = 0;

    for (const round of roundNumbers) {
      const matches = roundMap[round];
      if (slotIndex >= timeSlots.length) break;

      const [hour, min] = timeSlots[slotIndex].split(":").map(Number);
      const slotTime = new Date(dayDate);
      slotTime.setHours(hour, min, 0, 0);

      let matchIndex = 0;
      while (matchIndex < matches.length) {
        for (let t = 0; t < tableCount && matchIndex < matches.length; t++) {
          const match = matches[matchIndex];
          await prisma.match.update({
            where: { id: match.id },
            data: {
              startTime: slotTime,
              matchDate: slotTime,
              tableNumber: t + 1,
            },
          });
          matchIndex++;
        }
      }

      slotIndex++;
    }
  }

  // 🏁 Create GRAND FINAL
  if (Object.keys(groupMatchMap).length > 1) {
    const grandFinalTeamCount = Object.keys(groupMatchMap).length;
    const finalBracket = generateEmptyBracket(grandFinalTeamCount);
    const finalGroupCode = "Finals";

    // Schedule it on the next valid day
    const latestDay = Object.values(groupDayMap).sort(
      (a, b) => b.getTime() - a.getTime()
    )[0];
    const finalDay = getNextValidTournamentDay(latestDay);

    await saveBracketToDatabase(tournamentId, finalBracket, finalGroupCode);

    const finalsMatches = await prisma.match.findMany({
      where: { tournamentId, groupCode: finalGroupCode },
      orderBy: [{ round: "desc" }, { matchNumber: "asc" }],
    });

    let slotIndex = 0;
    let matchIndex = 0;

    while (matchIndex < finalsMatches.length) {
      if (slotIndex >= timeSlots.length) break;

      const [hour, min] = timeSlots[slotIndex].split(":").map(Number);
      const slotTime = new Date(finalDay);
      slotTime.setHours(hour, min, 0, 0);

      for (
        let t = 0;
        t < tableCount && matchIndex < finalsMatches.length;
        t++
      ) {
        const match = finalsMatches[matchIndex];
        await prisma.match.update({
          where: { id: match.id },
          data: {
            startTime: slotTime,
            matchDate: slotTime,
            tableNumber: t + 1,
          },
        });
        matchIndex++;
      }

      slotIndex++;
    }
  }
}
