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

  const currentDay = new Date(startDate);
  const scheduled: Match[] = [];

  const sortedRounds = Object.keys(groupedByRound)
    .map(Number)
    .sort((a, b) => b - a);

  const isDualGroup =
    matches.some((m) => m.groupCode?.endsWith("-أ")) &&
    matches.some((m) => m.groupCode?.endsWith("-ب")) &&
    tableCount <= 16;

  if (sortedRounds.length > 0) {
    const round = sortedRounds[0];
    const roundMatches = groupedByRound[round];

    const groups = [...new Set(roundMatches.map((m) => m.groupCode))];
    const useSeparateSlots = isDualGroup;

    if (useSeparateSlots) {
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
          match.matchDate = new Date(slotTime);
          match.tableNumber = (i % tableCount) + 1;
          scheduled.push(match);
        }
      }
    } else {
      const [hour, minute] = timeSlots[0].split(":").map(Number);
      const slotTime = new Date(currentDay);
      slotTime.setHours(hour, minute, 0, 0);

      for (let i = 0; i < roundMatches.length; i++) {
        const match = roundMatches[i];
        match.startTime = new Date(slotTime);
        match.matchDate = new Date(slotTime);
        match.tableNumber = (i % tableCount) + 1;
        scheduled.push(match);
      }
    }

    let slotIndex = isDualGroup ? 2 : 1;
    let matchDay = new Date(currentDay);

    for (let i = 1; i < sortedRounds.length; i++) {
      const round = sortedRounds[i];
      const roundMatches = groupedByRound[round];
      let matchIndex = 0;

      while (matchIndex < roundMatches.length) {
        if (slotIndex >= timeSlots.length) {
          matchDay = getNextTournamentDay(matchDay);
          slotIndex = isDualGroup ? 2 : 0;
        }

        const [h, m] = timeSlots[slotIndex].split(":").map(Number);
        const slotTime = new Date(matchDay);
        slotTime.setHours(h, m, 0, 0);

        for (
          let t = 0;
          t < tableCount && matchIndex < roundMatches.length;
          t++
        ) {
          const match = roundMatches[matchIndex];
          match.startTime = new Date(slotTime);
          match.matchDate = new Date(slotTime);
          match.tableNumber = t + 1;
          scheduled.push(match);
          matchIndex++;
        }

        slotIndex++;
      }
    }
  }

  return scheduled;
}

export function validateSchedule(matches: Match[]): string[] {
  const errors: string[] = [];
  const grouped = matches.reduce<Record<number, Match[]>>((acc, match) => {
    if (!acc[match.round]) acc[match.round] = [];
    acc[match.round].push(match);
    return acc;
  }, {});

  const rounds = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);
  let lastTime = new Date(0);

  for (const round of rounds) {
    for (const match of grouped[round]) {
      if (match.startTime && match.startTime < lastTime) {
        const error = `⛔ Round ${round} match at ${match.startTime.toISOString()} is before previous round time ${lastTime.toISOString()}`;
        errors.push(error);
      }
      if (match.startTime && match.startTime > lastTime) {
        lastTime = new Date(match.startTime);
      }
    }
  }

  return errors;
}
