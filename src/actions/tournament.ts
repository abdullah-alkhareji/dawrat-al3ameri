// src/actions/tournament.ts

"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addTournamentSchema } from "@/lib/scheemas";
import { Tournament, Team } from "@prisma/client";
import { scheduleFullTournament } from "@/lib/schedule-full-tournament";

export const createTournament = async (
  data: z.infer<typeof addTournamentSchema>
): Promise<{ success: boolean; data?: Tournament; error?: string }> => {
  console.log(`[TOURNAMENT_CREATE] Starting with data:`, {
    name: data.name,
    teamCount: data.teamCount,
    tableCount: data.tableCount,
    startDate:
      data.startDate instanceof Date
        ? data.startDate.toISOString()
        : data.startDate,
  });

  try {
    // Validate startDate
    if (!(data.startDate instanceof Date) || isNaN(data.startDate.getTime())) {
      console.error(`[TOURNAMENT_CREATE] Invalid startDate:`, data.startDate);
      return { success: false, error: "Invalid start date provided" };
    }

    // 1. Create tournament
    console.log(`[TOURNAMENT_CREATE] Creating tournament record`);
    const tournament = await prisma.tournament.create({
      data: {
        name: data.name,
        teamCount: data.teamCount,
        tableCount: data.tableCount,
        location: data.location,
        startDate: data.startDate,
        lastRegDate: data.lastRegDate,
      },
    });
    console.log(
      `[TOURNAMENT_CREATE] Tournament created with ID:`,
      tournament.id
    );

    // 2. Schedule full tournament
    try {
      console.log(`[TOURNAMENT_CREATE] Calling scheduleFullTournament`);
      await scheduleFullTournament({
        tournamentId: tournament.id,
        teamCount: tournament.teamCount,
        startDate: tournament.startDate,
        tableCount: tournament.tableCount,
      });
      console.log(
        `[TOURNAMENT_CREATE] Tournament scheduling completed successfully`
      );
    } catch (scheduleError) {
      console.error(`[TOURNAMENT_CREATE] Scheduling error:`, scheduleError);
      // Still return success since the tournament was created
      return {
        success: true,
        data: tournament,
        error: `Tournament created but scheduling failed: ${
          scheduleError instanceof Error
            ? scheduleError.message
            : String(scheduleError)
        }`,
      };
    }

    // 4. Revalidate
    revalidatePath("/tournaments");

    return { success: true, data: tournament };
  } catch (error) {
    console.error("[TOURNAMENT_CREATE] Error:", error);
    return {
      success: false,
      error: `Failed to create tournament: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

export const getTournaments = async (): Promise<{
  success: boolean;
  data?: (Tournament & { teams: Team[] })[];
  error?: string;
}> => {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: {
        startDate: "asc",
      },
      include: {
        teams: true,
      },
    });
    return { success: true, data: tournaments };
  } catch (error) {
    console.error("[TOURNAMENT_GET]", error);
    return { success: false, error: "Failed to get tournaments" };
  }
};

export const getTournament = async (
  id: string
): Promise<{
  success: boolean;
  data?: (Tournament & { teams: Team[] }) | null;
  error?: string;
}> => {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: { teams: true },
    });
    return { success: true, data: tournament };
  } catch (error) {
    console.error("[TOURNAMENT_GET]", error);
    return { success: false, error: "Failed to get tournament" };
  }
};
