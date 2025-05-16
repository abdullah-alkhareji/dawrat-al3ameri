import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
