// prisma/assignSeededTeamsToMatches.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function assignSeededTeamsToMatches(tournamentId: string) {
  // Get highest round (i.e., round 1 of matches)
  const highestRoundMatch = await prisma.match.findFirst({
    where: { tournamentId },
    orderBy: { round: "desc" },
  });

  if (!highestRoundMatch) throw new Error("No matches found.");

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

  // Group matches by groupCode
  const grouped: Record<string, typeof firstRoundMatches> = {};
  for (const match of firstRoundMatches) {
    if (!match.groupCode) continue;
    grouped[match.groupCode] ||= [];
    grouped[match.groupCode].push(match);
  }

  // Get all main teams that haven't been assigned to a match
  const teams = await prisma.team.findMany({
    where: {
      tournamentId,
      backup: false,
      groupCode: null,
    },
  });

  // Shuffle teams randomly
  const shuffled = teams.sort(() => Math.random() - 0.5);

  // Track slot assignments
  const assignments: {
    teamId: string;
    matchId: string;
    slot: "team1Id" | "team2Id";
    groupCode: string;
  }[] = [];

  // Assign teams randomly to available match slots
  for (const team of shuffled) {
    const groupCodes = Object.keys(grouped).filter((code) =>
      grouped[code].some((m) => !m.team1Id || !m.team2Id)
    );
    if (groupCodes.length === 0) break;

    const randomGroup =
      groupCodes[Math.floor(Math.random() * groupCodes.length)];
    const matches = grouped[randomGroup];

    const availableSlots = matches.flatMap((match) => {
      const slots: { matchId: string; slot: "team1Id" | "team2Id" }[] = [];
      if (!match.team1Id) slots.push({ matchId: match.id, slot: "team1Id" });
      if (!match.team2Id) slots.push({ matchId: match.id, slot: "team2Id" });
      return slots;
    });

    if (availableSlots.length === 0) continue;

    const chosen =
      availableSlots[Math.floor(Math.random() * availableSlots.length)];

    assignments.push({
      teamId: team.id,
      matchId: chosen.matchId,
      slot: chosen.slot,
      groupCode: randomGroup,
    });

    // Update local group tracking
    const match = matches.find((m) => m.id === chosen.matchId);
    if (match) match[chosen.slot] = team.id;
  }

  // Bulk update all assigned teams and matches
  await Promise.all([
    ...assignments.map((a) =>
      prisma.team.update({
        where: { id: a.teamId },
        data: { groupCode: a.groupCode },
      })
    ),
    ...assignments.map((a) =>
      prisma.match.update({
        where: { id: a.matchId },
        data: { [a.slot]: a.teamId },
      })
    ),
  ]);

  console.log(`✅ Assigned ${assignments.length} teams to round 1 matches`);
}
