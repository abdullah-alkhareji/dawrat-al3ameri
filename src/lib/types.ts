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

export type TournamentWithTeamsAndMatches = Tournament & {
  teams: Team[];
  matches: Match[];
};

// Match types from matches-list component
export type MatchWithTeams = Match & {
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
};

export type Round = {
  roundNumber: number;
  matches: MatchWithTeams[];
};

export type Group = {
  groupCode: string;
  rounds: Round[];
};

export type MatchDay = {
  day: string;
  groups: Group[];
};
