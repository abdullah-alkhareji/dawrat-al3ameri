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
