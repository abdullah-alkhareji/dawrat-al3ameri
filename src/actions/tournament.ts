"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTournament(data: {
  name: string;
  teamCount: number;
  location: string;
  startDate: Date;
  endDate: Date;
  lastRegDate: Date;
}) {
  try {
    const tournament = await prisma.tournament.create({
      data: {
        name: data.name,
        teamCount: data.teamCount,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        lastRegDate: data.lastRegDate,
      },
    });

    revalidatePath("/tournaments");
    return { success: true, data: tournament };
  } catch (error) {
    console.error("[TOURNAMENT_CREATE]", error);
    return { success: false, error: "Failed to create tournament" };
  }
}
