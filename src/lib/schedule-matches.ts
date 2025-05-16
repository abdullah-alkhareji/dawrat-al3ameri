// src/lib/schedule-matches.ts

import { Match } from "@prisma/client";

function isValidTournamentDay(date: Date, isFinal = false) {
  const day = date.getDay();
  console.log(`[DATE_DEBUG] Is valid day check:`, {
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
    result: day === 4 || day === 5 || (isFinal && day === 6),
  });
  return day === 4 || day === 5 || (isFinal && day === 6);
}

function getNextTournamentDay(date: Date, isFinal = false): Date {
  const next = new Date(date);
  next.setDate(date.getDate() + 1);
  console.log(
    `[DATE_DEBUG] Finding next tournament day after:`,
    date.toISOString()
  );
  while (!isValidTournamentDay(next, isFinal)) {
    next.setDate(next.getDate() + 1);
  }
  console.log(`[DATE_DEBUG] Next tournament day found:`, next.toISOString());
  return next;
}

// Helper function to create a consistent date-time object
function createDateTime(baseDate: Date, timeString: string): Date {
  // Parse the time string (format: "HH:MM")
  const [hours, minutes] = timeString.split(":").map(Number);

  // Create a new date object to avoid modifying the original
  const dateTime = new Date(baseDate);

  // Set hours and minutes, ensuring we use UTC methods for consistency
  dateTime.setUTCHours(hours, minutes, 0, 0);

  console.log(`[TIME_DEBUG] Created datetime:`, {
    baseDate: baseDate.toISOString(),
    timeString,
    result: dateTime.toISOString(),
  });

  return dateTime;
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
  console.log(`[SCHEDULE_MATCHES] Starting with params:`, {
    matchCount: matches.length,
    startDate: startDate instanceof Date ? startDate.toISOString() : startDate, // Log actual data type if not a Date
    tableCount,
    timeSlots,
  });

  // Validate startDate
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    console.error(`[SCHEDULE_MATCHES] Invalid startDate:`, startDate);
    throw new Error(
      "Invalid start date provided to scheduleSubTournamentMatches"
    );
  }

  const groupedByRound: Record<number, Match[]> = {};
  for (const match of matches) {
    if (!groupedByRound[match.round]) {
      groupedByRound[match.round] = [];
    }
    groupedByRound[match.round].push(match);
  }

  const currentDay = new Date(startDate);
  console.log(
    `[SCHEDULE_MATCHES] Current day set to:`,
    currentDay.toISOString()
  );
  const scheduled: Match[] = [];

  const sortedRounds = Object.keys(groupedByRound)
    .map(Number)
    .sort((a, b) => b - a);
  console.log(`[SCHEDULE_MATCHES] Sorted rounds:`, sortedRounds);

  const isDualGroup =
    matches.some((m) => m.groupCode?.endsWith("-A")) &&
    matches.some((m) => m.groupCode?.endsWith("-B")) &&
    tableCount <= 16;
  console.log(`[SCHEDULE_MATCHES] isDualGroup:`, isDualGroup);

  if (sortedRounds.length > 0) {
    const round = sortedRounds[0];
    const roundMatches = groupedByRound[round];
    console.log(
      `[SCHEDULE_MATCHES] Round ${round} has ${roundMatches.length} matches`
    );

    const groups = [...new Set(roundMatches.map((m) => m.groupCode))];
    console.log(`[SCHEDULE_MATCHES] Found groups:`, groups);
    const useSeparateSlots = isDualGroup;

    if (useSeparateSlots) {
      console.log(`[SCHEDULE_MATCHES] Using separate time slots for groups`);
      for (let g = 0; g < groups.length; g++) {
        const groupMatches = roundMatches.filter(
          (m) => m.groupCode === groups[g]
        );
        const timeSlot = timeSlots[g] || timeSlots[0];
        console.log(
          `[SCHEDULE_MATCHES] Group ${groups[g]} using time slot:`,
          timeSlot
        );

        // Create a consistent date time object
        const slotTime = createDateTime(currentDay, timeSlot);

        console.log(
          `[SCHEDULE_MATCHES] Slot time set to:`,
          slotTime.toISOString()
        );

        for (let i = 0; i < groupMatches.length; i++) {
          const match = groupMatches[i];
          match.startTime = new Date(slotTime);
          match.matchDate = new Date(slotTime);
          match.tableNumber = (i % tableCount) + 1;
          scheduled.push(match);
        }
      }
    } else {
      console.log(`[SCHEDULE_MATCHES] Using single time slot for all matches`);

      // Create a consistent date time object
      const slotTime = createDateTime(currentDay, timeSlots[0]);

      console.log(
        `[SCHEDULE_MATCHES] Slot time set to:`,
        slotTime.toISOString()
      );

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
    console.log(
      `[SCHEDULE_MATCHES] Starting later rounds from slot index:`,
      slotIndex
    );

    for (let i = 1; i < sortedRounds.length; i++) {
      const round = sortedRounds[i];
      const roundMatches = groupedByRound[round];
      console.log(
        `[SCHEDULE_MATCHES] Processing round ${round} with ${roundMatches.length} matches`
      );
      let matchIndex = 0;

      while (matchIndex < roundMatches.length) {
        if (slotIndex >= timeSlots.length) {
          matchDay = getNextTournamentDay(matchDay);
          slotIndex = isDualGroup ? 2 : 0;
          console.log(
            `[SCHEDULE_MATCHES] Moving to next day:`,
            matchDay.toISOString(),
            `at slot index:`,
            slotIndex
          );
        }

        const timeSlot = timeSlots[slotIndex];
        console.log(`[SCHEDULE_MATCHES] Using time slot:`, timeSlot);

        // Create a consistent date time object
        const slotTime = createDateTime(matchDay, timeSlot);

        console.log(
          `[SCHEDULE_MATCHES] Slot time set to:`,
          slotTime.toISOString()
        );

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

  console.log(`[SCHEDULE_MATCHES] Scheduled ${scheduled.length} matches`);
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
        errors.push(
          `⛔ Round ${round} match at ${match.startTime.toISOString()} is before previous round time ${lastTime.toISOString()}`
        );
      }
      if (match.startTime && match.startTime > lastTime) {
        lastTime = new Date(match.startTime);
      }
    }
  }

  return errors;
}
