// src/actions/teams.ts

"use server";

import { Team, Tournament } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { applicationFormSchema } from "@/lib/scheemas";
import { revalidatePath } from "next/cache";

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
      const highestRoundMatch = await prisma.match.findFirst({
        where: { tournamentId },
        orderBy: { round: "desc" },
      });

      if (highestRoundMatch) {
        const firstRoundMatches = await prisma.match.findMany({
          where: {
            tournamentId,
            round: highestRoundMatch.round,
            OR: [{ team1Id: null }, { team2Id: null }],
          },
          select: {
            id: true,
            groupCode: true,
            team1Id: true,
            team2Id: true,
          },
        });

        const grouped: Record<string, typeof firstRoundMatches> = {};
        for (const match of firstRoundMatches) {
          if (!match.groupCode) continue;
          grouped[match.groupCode] ||= [];
          grouped[match.groupCode].push(match);
        }

        const groupCodes = Object.keys(grouped);
        if (groupCodes.length > 0) {
          const randomGroup =
            groupCodes[Math.floor(Math.random() * groupCodes.length)];
          const matches = grouped[randomGroup];

          const availableSlots = matches.flatMap((match) => {
            const slots = [];
            if (!match.team1Id)
              slots.push({ matchId: match.id, slot: "team1Id" });
            if (!match.team2Id)
              slots.push({ matchId: match.id, slot: "team2Id" });
            return slots;
          });

          if (availableSlots.length > 0) {
            assignedGroupCode = randomGroup;
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
                backup: false,
                groupCode: assignedGroupCode,
              },
            });

            const randomSlot =
              availableSlots[Math.floor(Math.random() * availableSlots.length)];
            await prisma.match.update({
              where: { id: randomSlot.matchId },
              data: { [randomSlot.slot]: newTeam.id },
            });
          }
        }
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
    return { success: false, error: "في مشكلة أثناء التسجيل" };
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
