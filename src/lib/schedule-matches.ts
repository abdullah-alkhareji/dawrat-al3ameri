// src/lib/schedule-matches.ts

import { Match } from "@prisma/client";

function isValidTournamentDay(date: Date, isFinal = false) {
  const day = date.getDay();
  return day === 4 || day === 5 || (isFinal && day === 6); // Thu/Fri or Sat only for finals
}

function getNextTournamentDay(date: Date, isFinal = false): Date {
  const next = new Date(date);
  next.setDate(date.getDate() + 1);
  while (!isValidTournamentDay(next, isFinal)) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

export function scheduleSubTournamentMatches({
  matches,
  startDate,
  tableCount = 16,
  timeSlots,
}: {
  matches: Match[];
  startDate: Date;
  tableCount?: number;
  timeSlots: string[]; // <-- new
}): Match[] {
  const groupedByRound: Record<number, Match[]> = {};
  for (const match of matches) {
    if (!groupedByRound[match.round]) {
      groupedByRound[match.round] = [];
    }
    groupedByRound[match.round].push(match);
  }

  let currentDay = new Date(startDate);
  let slotIndex = 0;

  const scheduled: Match[] = [];

  const sortedRounds = Object.keys(groupedByRound)
    .map(Number)
    .sort((a, b) => a - b);

  for (const round of sortedRounds) {
    const roundMatches = groupedByRound[round];
    let matchIndex = 0;

    while (matchIndex < roundMatches.length) {
      if (slotIndex >= timeSlots.length) {
        currentDay = getNextTournamentDay(currentDay);
        slotIndex = 0;
      }

      const [hours, minutes] = timeSlots[slotIndex].split(":").map(Number);
      const slotDate = new Date(currentDay);
      slotDate.setHours(hours, minutes, 0, 0);

      for (let t = 0; t < tableCount && matchIndex < roundMatches.length; t++) {
        const match = roundMatches[matchIndex];
        match.startTime = new Date(slotDate);
        match.tableNumber = t + 1;
        match.matchDate = new Date(slotDate);
        scheduled.push(match);
        matchIndex++;
      }

      slotIndex++;
    }
  }

  return scheduled;
}
