// src/lib/db/seed.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const TOURNAMENT_NAME = "بطولة تجريبية";
  const TEAM_COUNT = 128;
  const BACKUP_COUNT = 100;

  const tournament = await prisma.tournament.create({
    data: {
      name: TOURNAMENT_NAME,
      teamCount: TEAM_COUNT,
      tableCount: 32,
      startDate: new Date("2025-05-22T18:00:00Z"),
      lastRegDate: new Date("2025-05-20T23:59:00Z"),
      location: "https://goo.gl/maps/example",
    },
  });

  const allTeams = [];

  for (let i = 0; i < TEAM_COUNT + BACKUP_COUNT; i++) {
    const isBackup = i >= TEAM_COUNT;
    const teamNumber = isBackup ? 0 : i + 1;

    allTeams.push({
      teamNumber,
      tournamentId: tournament.id,
      name1: `لاعب${i + 1}أ`,
      name2: `لاعب${i + 1}ب`,
      civilId1: `10000000${i + 1}`.padStart(12, "0"),
      civilId2: `20000000${i + 1}`.padStart(12, "0"),
      phone1: `5000${(i + 1).toString().padStart(4, "0")}`,
      phone2: `6000${(i + 1).toString().padStart(4, "0")}`,
      backup: isBackup,
      groupCode: null,
    });
  }

  await prisma.team.createMany({
    data: allTeams,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${TEAM_COUNT} teams + ${BACKUP_COUNT} backups into ${TOURNAMENT_NAME}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
