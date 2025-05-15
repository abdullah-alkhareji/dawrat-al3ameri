// src/actions/teams.ts

"use server";

import { Team, Tournament } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { applicationFormSchema } from "@/lib/scheemas";
import { revalidatePath } from "next/cache";
import { assignTeamToRandomMatch } from "@/lib/assign-team-to-random-match";

export const createTeam = async (
  data: z.infer<typeof applicationFormSchema>,
  tournamentId: string
): Promise<{
  success: boolean;
  data?: Team;
  groupCode?: string;
  error?: string;
}> => {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        _count: { select: { teams: true } },
      },
    });

    if (!tournament) {
      return { success: false, error: "البطولة مو موجودة" };
    }

    // Check for duplicate player
    const existingPlayers = await prisma.team.findFirst({
      where: {
        tournamentId,
        OR: [
          { civilId1: data.civilId1 },
          { civilId2: data.civilId1 },
          { civilId1: data.civilId2 },
          { civilId2: data.civilId2 },
        ],
      },
    });

    if (existingPlayers) {
      return { success: false, error: "اللاعب مسجل مع فريق ثاني" };
    }

    // Check for duplicate team
    const existingTeam = await prisma.team.findFirst({
      where: {
        tournamentId,
        civilId1: data.civilId1,
        civilId2: data.civilId2,
      },
    });

    if (existingTeam) {
      return { success: false, error: "الفريق مسجل من قبل" };
    }

    const isBackup = tournament._count.teams >= tournament.teamCount;
    const teamNumber = tournament._count.teams + 1;
    let assignedGroupCode: string | undefined = undefined;
    let newTeam: Team | null = null;

    // Try to assign to a match if not a backup
    if (!isBackup) {
      const created = await prisma.team.create({
        data: {
          tournamentId,
          teamNumber,
          name1: data.name1,
          name2: data.name2,
          civilId1: data.civilId1,
          civilId2: data.civilId2,
          phone1: data.phone1,
          phone2: data.phone2,
          backup: false,
          groupCode: null,
        },
      });

      const groupCode = await assignTeamToRandomMatch({
        tournamentId,
        teamId: created.id,
      });

      if (groupCode) {
        await prisma.team.update({
          where: { id: created.id },
          data: { groupCode },
        });
        newTeam = created;
        assignedGroupCode = groupCode;
      }
    }

    // If not assigned to match, fallback to backup
    if (!newTeam) {
      newTeam = await prisma.team.create({
        data: {
          tournamentId,
          teamNumber,
          name1: data.name1,
          name2: data.name2,
          civilId1: data.civilId1,
          civilId2: data.civilId2,
          phone1: data.phone1,
          phone2: data.phone2,
          backup: true,
          groupCode: null,
        },
      });
    }

    revalidatePath("/[id]/teams", "page");

    return { success: true, data: newTeam, groupCode: assignedGroupCode };
  } catch (error) {
    console.error("[TEAM_CREATE]", error);
    return { success: false, error: "في شي غلط" };
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
      where: { id },
      include: {
        tournament: true,
      },
    });

    return { success: true, data: team };
  } catch (error) {
    console.error("[TEAM_GET]", error);
    return { success: false, error: "في شي غلط" };
  }
};

export const getTeamByTournamentId = async (
  tournamentId: string
): Promise<{ success: boolean; data?: Team[]; error?: string }> => {
  try {
    const teams = await prisma.team.findMany({
      where: { tournamentId },
      orderBy: { teamNumber: "asc" },
    });

    return { success: true, data: teams };
  } catch (error) {
    console.error("[TEAM_GET_BY_TOURNAMENT_ID]", error);
    return { success: false, error: "في شي غلط" };
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
    return { success: false, error: "في شي غلط" };
  }
};

export const updateTeam = async (
  id: string,
  data: z.infer<typeof applicationFormSchema>
) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: id },
    });

    if (!team) {
      return { success: false, error: "الفريق مو موجود" };
    }

    const existingPlayers = await prisma.team.findFirst({
      where: {
        OR: [
          { civilId1: data.civilId1 },
          { civilId2: data.civilId1 },
          { civilId1: data.civilId2 },
          { civilId2: data.civilId2 },
        ],
      },
    });
    if (existingPlayers && existingPlayers.id !== id) {
      return { success: false, error: "اللاعب مسجل مع فريق ثاني" };
    }

    await prisma.team.update({
      where: { id: id },
      data: data,
    });
    revalidatePath("/[id]/teams", "page");
    return { success: true };
  } catch (error) {
    console.error("[TEAM_UPDATE]", error);
    return { success: false, error: "في شي غلط" };
  }
};
