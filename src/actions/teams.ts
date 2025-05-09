"use server";

import { Team } from "@/generated/prisma";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { applicationFormSchema } from "@/lib/scheemas";

export const createTeam = async (
  data: z.infer<typeof applicationFormSchema>,
  tournamentId: string
): Promise<{ success: boolean; data?: Team; error?: string }> => {
  try {
    const newTeam = await prisma.team.create({
      data: {
        tournamentId: tournamentId,
        teamNumber: data.teamNumber,
        name1: data.name1,
        name2: data.name2,
        civilId1: data.civilId1,
        civilId2: data.civilId2,
        phone1: data.phone1,
        phone2: data.phone2,
      },
    });
    console.log(newTeam);
    return { success: true, data: newTeam };
  } catch (error) {
    console.error("[TEAM_CREATE]", error);
    return { success: false, error: "Failed to create team" };
  }
};

export const getTeam = async (
  id: string
): Promise<{ success: boolean; data?: Team | null; error?: string }> => {
  try {
    const team = await prisma.team.findUnique({
      where: {
        id: id,
      },
    });
    return { success: true, data: team };
  } catch (error) {
    console.error("[TEAM_GET]", error);
    return { success: false, error: "Failed to get team" };
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
    });
    return { success: true, data: teams };
  } catch (error) {
    console.error("[TEAM_GET_BY_TOURNAMENT_ID]", error);
    return { success: false, error: "Failed to get teams" };
  }
};
