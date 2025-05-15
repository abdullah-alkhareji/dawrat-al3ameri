// prisma/seed-functional.ts

import { PrismaClient } from "@prisma/client";
import { scheduleFullTournament } from "@/lib/schedule-full-tournament";
import { assignSeededTeamsToMatches } from "./assignSeededTeamsToMatches";

const prisma = new PrismaClient();

async function main() {
  const TEAM_COUNT = 128;
  const BACKUP_COUNT = 100;
  const START_DATE = new Date("2025-05-22T18:00:00+03:00");

  // 1. Create tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: "بطولة تجريبية شاملة",
      teamCount: TEAM_COUNT,
      tableCount: 16,
      startDate: START_DATE,
      lastRegDate: new Date("2025-05-20T23:59:00+03:00"),
      location: "https://goo.gl/maps/test",
    },
  });

  // 2. Create main teams
  const mainTeams = Array.from({ length: TEAM_COUNT }).map((_, i) => ({
    teamNumber: i + 1,
    tournamentId: tournament.id,
    name1: `لاعب${i + 1}أ`,
    name2: `لاعب${i + 1}ب`,
    civilId1: `1${String(i + 1).padStart(11, "0")}`,
    civilId2: `2${String(i + 1).padStart(11, "0")}`,
    phone1: `5${String(i + 1).padStart(7, "0")}`,
    phone2: `6${String(i + 1).padStart(7, "0")}`,
    backup: false,
    groupCode: null,
  }));

  await prisma.team.createMany({
    data: mainTeams,
    skipDuplicates: true,
  });

  // 3. Create backup teams
  const backupTeams = Array.from({ length: BACKUP_COUNT }).map((_, i) => ({
    teamNumber: 0,
    tournamentId: tournament.id,
    name1: `احتياط${i + 1}أ`,
    name2: `احتياط${i + 1}ب`,
    civilId1: `3${String(i + 1).padStart(11, "0")}`,
    civilId2: `4${String(i + 1).padStart(11, "0")}`,
    phone1: `7${String(i + 1).padStart(7, "0")}`,
    phone2: `8${String(i + 1).padStart(7, "0")}`,
    backup: true,
    groupCode: null,
  }));

  await prisma.team.createMany({
    data: backupTeams,
    skipDuplicates: true,
  });

  // 4. Schedule full tournament (brackets + times + finals)
  await scheduleFullTournament({
    tournamentId: tournament.id,
    teamCount: TEAM_COUNT,
    startDate: START_DATE,
    tableCount: tournament.tableCount,
    timeSlots: ["18:00", "19:30", "21:00", "22:30", "00:00", "01:30"],
  });

  await assignSeededTeamsToMatches(tournament.id);

  console.log(
    `✅ Seeded tournament with ${TEAM_COUNT} teams, ${BACKUP_COUNT} backups, and full match schedule`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding tournament:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
