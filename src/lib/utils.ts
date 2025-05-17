import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { Group, MatchDay, MatchWithTeams, Round } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date using the GB locale format (DD/MM/YYYY)
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Calculate tournament registration status
 */
export function getTournamentStatus(
  teamsRegistered: number,
  teamCount: number
): {
  status: string;
  statusColor: string;
} {
  const status = teamsRegistered >= teamCount ? "مكتمل" : "مفتوح";
  const statusColor =
    teamsRegistered >= teamCount ? "bg-red-600" : "bg-green-600";

  return { status, statusColor };
}

/**
 * Format match round number to appropriate Arabic names
 */
export function formatMatchRound(round: number): string {
  switch (round) {
    case 1:
      return "النهائي";
    case 2:
      return "نصف النهائي";
    case 3:
      return "ربع النهائي";
    case 4:
      return "دور الـ 8";
    case 5:
      return "دور الـ 16";
    case 6:
      return "دور الـ 32";
    case 7:
      return "دور الـ 64";
    default:
      return `الجولة ${round}`;
  }
}

/**
 * Group matches by day, group, and round
 */
export function groupMatches(matches: MatchWithTeams[]): MatchDay[] {
  const dayMap = new Map<string, Map<string, Map<number, MatchWithTeams[]>>>();

  // First, sort and group the matches
  matches
    .sort(
      (a, b) =>
        new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
    )
    .forEach((match) => {
      const day = format(new Date(match.matchDate), "EEEE yyyy-MM-dd", {
        locale: arSA,
      });
      const groupCode = match.groupCode || "Unknown Group";
      const round = match.round;

      // Create day if not exists
      if (!dayMap.has(day)) {
        dayMap.set(day, new Map());
      }

      const groupMap = dayMap.get(day)!;

      // Create group if not exists
      if (!groupMap.has(groupCode)) {
        groupMap.set(groupCode, new Map());
      }

      const roundMap = groupMap.get(groupCode)!;

      // Create round if not exists
      if (!roundMap.has(round)) {
        roundMap.set(round, []);
      }

      // Add match to round
      roundMap.get(round)!.push(match);
    });

  // Convert to the desired structure
  const result: MatchDay[] = [];

  // Process days
  dayMap.forEach((groupMap, day) => {
    const groups: Group[] = [];

    // Process groups
    groupMap.forEach((roundMap, groupCode) => {
      const rounds: Round[] = [];

      // Process rounds
      roundMap.forEach((matchesInRound, roundNumber) => {
        rounds.push({
          roundNumber: roundNumber,
          matches: matchesInRound,
        });
      });

      // Sort rounds
      rounds
        .sort((a, b) => +b.roundNumber - +a.roundNumber)
        .map((round) => {
          round.roundNumber = round.roundNumber;
        });

      groups.push({
        groupCode,
        rounds,
      });
    });

    // Sort groups alphabetically
    groups.sort((a, b) => {
      // Don't strip Arabic characters, only non-alphanumeric characters except Arabic
      const groupACode = a.groupCode;
      const groupBCode = b.groupCode;
      return groupACode.localeCompare(groupBCode);
    });

    result.push({
      day,
      groups,
    });
  });

  // Sort days
  result.sort((a, b) => {
    const dateA = new Date(a.day.split(" ")[1]).getTime();
    const dateB = new Date(b.day.split(" ")[1]).getTime();

    return dateA - dateB;
  });

  return result;
}

/**
 * Get groups from a match day
 */
export function getDayGroups(matchDay: MatchDay): Group[] {
  return matchDay.groups;
}

/**
 * Get rounds from a group
 */
export function getGroupRounds(group: Group | null): Round[] {
  return group?.rounds || [];
}
