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
  try {
    // 1. Create tournament
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

    // 2. Schedule full tournament
    await scheduleFullTournament({
      tournamentId: tournament.id,
      teamCount: tournament.teamCount,
      startDate: tournament.startDate,
      tableCount: tournament.tableCount,
    });

    // 4. Revalidate
    revalidatePath("/tournaments");

    return { success: true, data: tournament };
  } catch (error) {
    console.error("[TOURNAMENT_CREATE]", error);
    return { success: false, error: "Failed to create tournament" };
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
