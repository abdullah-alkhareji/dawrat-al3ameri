// src/app/(protected)/[id]/matches/_components/matches-list.tsx

"use client";

import React from "react";
import { Match, Team } from "@prisma/client";
import MatchCard from "./match-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

export type MatchWithTeams = Match & {
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
};

type MatchesListProps = {
  matches: MatchWithTeams[];
};

function groupMatches(matches: MatchWithTeams[]) {
  return matches
    .sort(
      (a, b) =>
        new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
    )
    .reduce((acc, match) => {
      const day = format(new Date(match.matchDate), "EEEE dd/MM/yyyy", {
        locale: arSA,
      });
      const group = match.groupCode || "Unknown Group";
      const round = match.round;

      acc[day] ||= {};
      acc[day][group] ||= {};
      acc[day][group][round] ||= [];
      acc[day][group][round].push(match);

      return acc;
    }, {} as Record<string, Record<string, Record<number, MatchWithTeams[]>>>);
}

const MatchesList = ({ matches }: MatchesListProps) => {
  const grouped = groupMatches(matches);
  const days = Object.keys(grouped);

  return (
    <Tabs defaultValue={days.reverse()[0]} className="space-y-4">
      <TabsList
        className="flex flex-nowrap w-full overflow-x-auto flex-row-reverse"
        dir="rtl"
      >
        {days.reverse().map((day) => (
          <TabsTrigger
            key={day}
            value={day}
            className="whitespace-nowrap text-right"
          >
            {day}
          </TabsTrigger>
        ))}
      </TabsList>

      {days.map((day) => (
        <TabsContent dir="rtl" key={day} value={day} className="space-y-6">
          {Object.entries(grouped[day])
            .reverse()
            .map(([groupCode, rounds]) => (
              <div key={groupCode} className="space-y-4">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  مجموعة {groupCode.replace("Day", "اليوم ")}
                </h3>
                <Accordion type="multiple" className="w-full">
                  {Object.entries(rounds)
                    .reverse()
                    .map(([roundNum, matches], index) => (
                      <AccordionItem
                        key={roundNum}
                        value={`round-${groupCode}-${roundNum}`}
                      >
                        <AccordionTrigger>
                          {+roundNum === 1
                            ? "النهائي"
                            : +roundNum === 2
                            ? "نصف النهائي"
                            : +roundNum === 3
                            ? "ربع النهائي"
                            : `الجولة ${index + 1}`}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {matches.map((match) => (
                              <MatchCard
                                key={match.id}
                                match={match}
                                round={index + 1}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default MatchesList;
