// src/lib/schedule-matches.ts

import { Match } from "@prisma/client";

function isValidTournamentDay(date: Date, isFinal = false) {
  const day = date.getDay();
  return day === 4 || day === 5 || (isFinal && day === 6);
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
  timeSlots: string[];
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
    .sort((a, b) => b - a); // Round 5 → Round 1

  for (let roundIdx = 0; roundIdx < sortedRounds.length; roundIdx++) {
    const round = sortedRounds[roundIdx];
    const roundMatches = groupedByRound[round];

    // Round 1: groupA at slot 0, groupB at slot 1
    if (roundIdx === 0) {
      const groups = [...new Set(roundMatches.map((m) => m.groupCode))];
      for (let g = 0; g < groups.length; g++) {
        const groupMatches = roundMatches.filter(
          (m) => m.groupCode === groups[g]
        );
        const [hour, minute] = timeSlots[g]?.split(":").map(Number) || [18, 0];
        const slotTime = new Date(currentDay);
        slotTime.setHours(hour, minute, 0, 0);

        for (let i = 0; i < groupMatches.length; i++) {
          const match = groupMatches[i];
          match.startTime = new Date(slotTime);
          match.tableNumber = (i % tableCount) + 1;
          match.matchDate = new Date(slotTime);
          scheduled.push(match);
        }
      }
      slotIndex = groups.length; // Start next round after initial groups
    } else {
      let matchIndex = 0;
      while (matchIndex < roundMatches.length) {
        if (slotIndex >= timeSlots.length) {
          currentDay = getNextTournamentDay(currentDay);
          slotIndex = 0;
        }

        const [hour, minute] = timeSlots[slotIndex].split(":").map(Number);
        const slotTime = new Date(currentDay);
        slotTime.setHours(hour, minute, 0, 0);

        for (
          let t = 0;
          t < tableCount && matchIndex < roundMatches.length;
          t++
        ) {
          const match = roundMatches[matchIndex];
          match.startTime = new Date(slotTime);
          match.tableNumber = t + 1;
          match.matchDate = new Date(slotTime);
          scheduled.push(match);
          matchIndex++;
        }

        slotIndex++;
      }
    }
  }

  return scheduled;
}
