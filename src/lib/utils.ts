// import { Tournament, Match } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function generateMatches(
//   tournament: Tournament
// ): Omit<Match, "id" | "createdAt">[] {
//   const { teamCount, startDate, id: tournamentId } = tournament;

//   const totalRounds = Math.log2(teamCount);
//   const matches: Omit<Match, "id" | "createdAt">[] = [];

//   const matchesPerSlot = 32;
//   const slotDurationMinutes = 90;
//   const slotsPerDay = 5;
//   const maxMatchesPerDay = matchesPerSlot * slotsPerDay;

//   let matchNumber = 1;
//   let currentDayOffset = 0;
//   let currentSlotIndex = 0;

//   for (let r = 0; r < totalRounds; r++) {
//     const round = totalRounds - r;
//     const matchesInRound = teamCount / Math.pow(2, r + 1);

//     for (let m = 0; m < matchesInRound; m++) {
//       // Reset to next day if we exceed time or capacity
//       if (currentSlotIndex >= slotsPerDay) {
//         currentSlotIndex = 0;
//         currentDayOffset++;
//       }

//       const matchDate = new Date(startDate);
//       matchDate.setDate(matchDate.getDate() + currentDayOffset);
//       matchDate.setHours(18, 0, 0, 0); // Start at 6:00 PM
//       matchDate.setMinutes(
//         matchDate.getMinutes() + currentSlotIndex * slotDurationMinutes
//       );

//       matches.push({
//         tournamentId,
//         round,
//         matchNumber: matchNumber++,
//         matchDate,
//         team1Id: null,
//         team2Id: null,
//         winnerId: null,
//       });

//       // After scheduling one match, check if current slot is full (32 matches max)
//       // Since we’re just tracking match count, simulate full slot every 32 matches
//       const matchIndexInDay = (matchNumber - 1) % maxMatchesPerDay;
//       const isEndOfSlot = matchIndexInDay % matchesPerSlot === 0;

//       if (isEndOfSlot) {
//         currentSlotIndex++;
//       }
//     }
//   }

//   return matches;
// }
