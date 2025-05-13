"use client";

import React, { useEffect, useState } from "react";
import { Match, Team } from "@prisma/client";
import MatchCard from "./match-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type MatchWithTeams = Match & {
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
};

type MatchesListProps = {
  matches: MatchWithTeams[];
};

const MatchesList = ({ matches }: MatchesListProps) => {
  const [filteredMatches, setFilteredMatches] =
    useState<MatchWithTeams[]>(matches);
  const [filter, setFilter] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [teamNumber, setTeamNumber] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const maxRound = Math.max(...matches.map((match) => match.round));
      setFilter(maxRound);
      setFilteredMatches(matches.filter((match) => match.round === maxRound));
      setIsLoading(false);
    };

    fetchData();
  }, [matches]);

  useEffect(() => {
    if (teamNumber) {
      setFilteredMatches(
        matches.filter(
          (match) =>
            match.team1?.teamNumber === teamNumber ||
            match.team2?.teamNumber === teamNumber
        )
      );
    }
  }, [teamNumber, matches]);

  const rounds = [...new Set(matches.map((match) => match.round))]
    .sort((a, b) => b - a)
    .map((round, index) => ({
      round,
      id: index + 1,
      isActive: round === filter,
      label:
        round === 1
          ? "النهائي"
          : round === 2
          ? "نص النهائي"
          : round === 3
          ? "ربع النهائي"
          : `الجولة ${index + 1}`,
    }));

  const handleFilter = (round: number) => {
    setFilter(round);
    setFilteredMatches(matches.filter((match) => match.round === round));
  };

  const handleTeamNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const finalValue = +value.replace(/\D/g, "");
    setTeamNumber(finalValue);
  };

  console.log({ rounds });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2 w-full justify-start overflow-x-auto max-w-screen pe-4">
        {rounds.map((round) => (
          <Button
            key={round.id}
            variant={round.isActive ? "default" : "outline"}
            onClick={() => handleFilter(round.round)}
          >
            {round.label}
          </Button>
        ))}
      </div>
      <div className="p-4 bg-card rounded-lg flex flex-col gap-4">
        <Input
          placeholder="رقم الفريق"
          type="number"
          className="w-full"
          onChange={handleTeamNumberChange}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4",
            {
              "grid-cols-1 lg:grid-cols-1 xl:grid-cols-1": filter === 1,
              "grid-cols-1 lg:grid-cols-2 xl:grid-cols-2":
                filter === 2 || filter === 3,
            }
          )}
        >
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              round={
                rounds.find((round) => round.round === match.round)?.id ?? 0
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchesList;
