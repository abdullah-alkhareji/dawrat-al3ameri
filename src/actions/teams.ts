"use server";

import { Team, Tournament } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { applicationFormSchema } from "@/lib/scheemas";
import { revalidatePath } from "next/cache";

export const createTeam = async (
  data: z.infer<typeof applicationFormSchema>,
  tournamentId: string
): Promise<{ success: boolean; data?: Team; error?: string }> => {
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

    const existingPlayers = await prisma.team.findFirst({
      where: {
        tournamentId,
        OR: [{ civilId1: data.civilId1 }, { civilId2: data.civilId1 }],
      },
    });

    if (existingPlayers) {
      return { success: false, error: "اللاعب مسجل" };
    }

    const existingTeam = await prisma.team.findFirst({
      where: {
        tournamentId,
        civilId1: data.civilId1,
        civilId2: data.civilId2,
      },
    });

    if (existingTeam) {
      return { success: false, error: "فريق مسجل" };
    }

    const isBackup = tournament.teamCount <= tournament._count.teams;
    const teamNumber = tournament._count.teams + 1;

    const newTeam = await prisma.team.create({
      data: {
        tournamentId,
        teamNumber,
        name1: data.name1,
        name2: data.name2,
        civilId1: data.civilId1,
        civilId2: data.civilId2,
        phone1: data.phone1,
        phone2: data.phone2,
        backup: isBackup,
      },
    });

    // ✅ Assign to a match if not backup
    if (!isBackup) {
      // Get the highest round number (i.e., first round)
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
        });

        // Pick a random empty match
        const availableSlots = firstRoundMatches.flatMap((match) => {
          const slots = [];
          if (!match.team1Id)
            slots.push({ matchId: match.id, slot: "team1Id" });
          if (!match.team2Id)
            slots.push({ matchId: match.id, slot: "team2Id" });
          return slots;
        });

        if (availableSlots.length > 0) {
          const randomSlot =
            availableSlots[Math.floor(Math.random() * availableSlots.length)];
          await prisma.match.update({
            where: { id: randomSlot.matchId },
            data: { [randomSlot.slot]: newTeam.id },
          });
        }
      }
    }

    revalidatePath("/[id]/teams", "page");

    return { success: true, data: newTeam };
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
    return { success: false, error: "في شي غلط" };
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
