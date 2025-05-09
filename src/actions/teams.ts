"use server";

import { Team, Tournament } from "@/generated/prisma";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { applicationFormSchema } from "@/lib/scheemas";
import { revalidatePath } from "next/cache";

export const createTeam = async (
  data: z.infer<typeof applicationFormSchema>,
  tournamentId: string
): Promise<{ success: boolean; data?: Team; error?: string }> => {
  try {
    // Check if tournament exists and get its team count
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        _count: {
          select: { teams: true },
        },
      },
    });

    if (!tournament) {
      return { success: false, error: "البطولة غير موجودة" };
    }

    // Check if tournament is full
    if (tournament._count.teams >= tournament.teamCount) {
      return { success: false, error: "البطولة مكتملة العدد" };
    }

    // Check if either player is already registered in this tournament
    const existingPlayers = await prisma.team.findFirst({
      where: {
        tournamentId,
        OR: [{ civilId1: data.civilId1 }, { civilId2: data.civilId1 }],
      },
    });

    if (existingPlayers) {
      return { success: false, error: "اللاعب مسجل مسبقاً في هذه البطولة" };
    }

    // Check if this exact team combination already exists
    const existingTeam = await prisma.team.findFirst({
      where: {
        tournamentId,
        civilId1: data.civilId1,
        civilId2: data.civilId2,
      },
    });

    if (existingTeam) {
      return { success: false, error: "هذا الفريق مسجل مسبقاً في هذه البطولة" };
    }

    const newTeam = await prisma.team.create({
      data: {
        tournamentId: tournamentId,
        name1: data.name1,
        name2: data.name2,
        civilId1: data.civilId1,
        civilId2: data.civilId2,
        phone1: data.phone1,
        phone2: data.phone2,
      },
    });
    revalidatePath("/[id]/teams", "page");

    return { success: true, data: newTeam };
  } catch (error) {
    console.error("[TEAM_CREATE]", error);
    return { success: false, error: "حدث خطأ" };
  }
};

export const getTeam = async (
  id: string
): Promise<{
  success: boolean;
  data?: (Team & { tournament: Tournament }) | null;
  error?: string;
}> => {
  try {
    const team = await prisma.team.findUnique({
      where: {
        id: id,
      },
      include: {
        tournament: true,
      },
    });
    return { success: true, data: team };
  } catch (error) {
    console.error("[TEAM_GET]", error);
    return { success: false, error: "حدث خطأ" };
  }
};

export const getTeamByTournamentId = async (
  tournamentId: string
): Promise<{ success: boolean; data?: Team[]; error?: string }> => {
  try {
    const teams = await prisma.team.findMany({
      where: {
        tournamentId: tournamentId,
      },
      orderBy: {
        teamNumber: "asc",
      },
    });
    return { success: true, data: teams };
  } catch (error) {
    console.error("[TEAM_GET_BY_TOURNAMENT_ID]", error);
    return { success: false, error: "حدث خطأ" };
  }
};

export const deleteTeam = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await prisma.team.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/[id]/teams", "page");
    return { success: true };
  } catch (error) {
    console.error("[TEAM_DELETE]", error);
    return { success: false, error: "حدث خطأ" };
  }
};
