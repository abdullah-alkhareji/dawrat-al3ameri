// src/lib/types.ts

import { Match, Team, Tournament } from "@prisma/client";

export type PartialMatch = Omit<Match, "id" | "createdAt">;

export type TeamWithMatches = Team & {
  tournament: Tournament;
  matchesAsTeam1: (Match & {
    team1: Team;
    team2: Team;
  })[];
  matchesAsTeam2: (Match & {
    team1: Team;
    team2: Team;
  })[];
};
