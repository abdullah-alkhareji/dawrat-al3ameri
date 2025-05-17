// src/app/(protected)/[id]/matches/_components/matches-list.tsx

"use client";

import React, { useEffect, useState } from "react";
import MatchCard from "./match-card";
import {
  formatMatchRound,
  groupMatches,
  getDayGroups,
  getGroupRounds,
  cn,
} from "@/lib/utils";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Loader2, Users, ListFilter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MatchDay, MatchWithTeams, Group, Round } from "@/lib/types";

type MatchesListProps = {
  matches: MatchWithTeams[];
};

const MatchesList = ({ matches }: MatchesListProps) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selecterMatcheDay, setSelecterMatcheDay] = useState<MatchDay | null>(
    null
  );
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const matchDays = groupMatches(matches);
  const days = matchDays.map((day) => day.day);

  useEffect(() => {
    if (days.length > 0) {
      setSelectedDay(days[0]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (selectedDay) {
      const matchDay = matchDays.find((day) => day.day === selectedDay);
      if (matchDay) {
        setSelecterMatcheDay(matchDay);
        setGroups(getDayGroups(matchDay));
      }
    }
    setIsLoading(false);
  }, [selectedDay]);

  useEffect(() => {
    if (groups.length > 0) {
      setSelectedGroup(groups[0].groupCode);
      // Initialize rounds based on the first group
      const initialRounds = getGroupRounds(groups[0]);
      setRounds(initialRounds);

      // Initialize selectedRound with the first round if available
      if (initialRounds.length > 0) {
        setSelectedRound(initialRounds[0].roundNumber);
      }
    }
  }, [groups]);

  const handleDayChange = (value: string) => {
    setIsLoading(true);
    setSelectedDay(value);
    setSelecterMatcheDay(matchDays.find((day) => day.day === value) || null);
    setIsLoading(false);
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setRounds(
      getGroupRounds(groups.find((group) => group.groupCode === value) || null)
    );
  };

  const handleRoundChange = (value: string) => {
    setSelectedRound(Number(value));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="px-2 py-0">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span className="text-sm font-medium">اليوم</span>
              </div>
              <Select
                defaultValue={selectedDay ?? undefined}
                onValueChange={(e) => handleDayChange(e)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="اختر اليوم" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span className="text-sm font-medium">المجموعة</span>
              </div>
              <Select
                value={selectedGroup ?? undefined}
                onValueChange={(e) => handleGroupChange(e)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="اختر المجموعة" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.groupCode} value={group.groupCode}>
                      {group.groupCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ListFilter className="size-4 text-primary" />
                <span className="text-sm font-medium">الدور</span>
              </div>
              <Select
                value={selectedRound?.toString() ?? undefined}
                onValueChange={(e) => handleRoundChange(e)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  {rounds.map((round) => (
                    <SelectItem
                      key={round.roundNumber}
                      value={round.roundNumber.toString()}
                    >
                      {formatMatchRound(+round.roundNumber)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        className={cn("grid grid-cols-1 gap-4", {
          "opacity-50": isLoading,
          "md:grid-cols-1": selectedRound === 1,
          "md:grid-cols-2": selectedRound !== 1,
        })}
      >
        {selecterMatcheDay?.groups
          .filter((group) => group.groupCode === selectedGroup)
          .map((group) => (
            <React.Fragment key={group.groupCode}>
              {group.rounds
                .filter((round) => round.roundNumber === selectedRound)
                .map((round) => (
                  <React.Fragment key={round.roundNumber}>
                    {round.matches
                      .filter((match) => match.round === selectedRound)
                      .map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default MatchesList;
