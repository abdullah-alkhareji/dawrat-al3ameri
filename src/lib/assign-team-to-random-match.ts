import prisma from "./prisma";

type AssignTeamToRandomMatchOptions = {
  tournamentId: string;
  teamId: string;
};

export async function assignTeamToRandomMatch({
  tournamentId,
  teamId,
}: AssignTeamToRandomMatchOptions): Promise<string | null> {
  const highestRoundMatch = await prisma.match.findFirst({
    where: { tournamentId },
    orderBy: { round: "desc" },
  });

  if (!highestRoundMatch) return null;

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
  if (groupCodes.length === 0) return null;

  const randomGroup = groupCodes[Math.floor(Math.random() * groupCodes.length)];
  const matches = grouped[randomGroup];

  const availableSlots = matches.flatMap((match) => {
    const slots: { matchId: string; slot: "team1Id" | "team2Id" }[] = [];
    if (!match.team1Id) slots.push({ matchId: match.id, slot: "team1Id" });
    if (!match.team2Id) slots.push({ matchId: match.id, slot: "team2Id" });
    return slots;
  });

  if (availableSlots.length === 0) return null;

  const randomSlot =
    availableSlots[Math.floor(Math.random() * availableSlots.length)];

  await prisma.match.update({
    where: { id: randomSlot.matchId },
    data: { [randomSlot.slot]: teamId },
  });

  return randomGroup;
}
