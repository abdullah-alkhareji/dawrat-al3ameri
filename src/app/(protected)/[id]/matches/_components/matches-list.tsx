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
import { Badge } from "@/components/ui/badge";
import { formatMatchRound } from "@/lib/utils";
import { cn } from "@/lib/utils";

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

// Helper function to sort groups alphabetically
function getSortedGroups(
  groups: Record<string, Record<number, MatchWithTeams[]>>
): [string, Record<number, MatchWithTeams[]>][] {
  return Object.entries(groups).sort(([groupA], [groupB]) => {
    // Extract any numbers from the group codes for proper sorting
    const groupACode = groupA.replace(/[^A-Za-z0-9]/g, "");
    const groupBCode = groupB.replace(/[^A-Za-z0-9]/g, "");
    return groupACode.localeCompare(groupBCode);
  });
}

const MatchesList = ({ matches }: MatchesListProps) => {
  // Group all matches first
  const grouped = groupMatches(matches);
  const days = Object.keys(grouped).reverse();

  return (
    <div className="space-y-4">
      <Tabs defaultValue={days[0]} className="space-y-4" dir="rtl">
        <div className="relative overflow-hidden">
          <TabsList
            className="flex flex-nowrap w-full overflow-x-auto bg-muted/70 py-2 px-1 rounded-lg no-scrollbar"
            dir="rtl"
          >
            {days.map((day, i) => {
              // Format the day to make it more mobile-friendly
              const dateParts = day.split(" ");
              const dayName = dateParts[0];
              const dateValue = dateParts[1];

              return (
                <TabsTrigger
                  key={day}
                  value={day}
                  className={cn(
                    "whitespace-nowrap text-right rounded-md min-w-[100px] data-[state=active]:bg-background data-[state=active]:shadow",
                    i === 0 && "mr-1"
                  )}
                >
                  <div className="flex flex-col text-xs">
                    <span className="font-bold">{dayName}</span>
                    <span className="text-muted-foreground">{dateValue}</span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {days.map((day) => (
          <TabsContent
            dir="rtl"
            key={day}
            value={day}
            className="space-y-8 p-0"
          >
            {getSortedGroups(grouped[day]).map(([groupCode, rounds]) => {
              // Check if there are any matches in this group
              const hasMatchesInGroup = Object.values(rounds).some(
                (matchesArray: MatchWithTeams[]) => matchesArray.length > 0
              );

              if (!hasMatchesInGroup) {
                return null;
              }

              return (
                <div
                  key={groupCode}
                  className="space-y-4 bg-muted/30 p-4 rounded-lg"
                >
                  <h3 className="text-lg font-semibold text-primary">
                    مجموعة {groupCode.replace("Day", "اليوم ")}
                  </h3>
                  <Accordion type="multiple" className="w-full">
                    {Object.entries(rounds)
                      .reverse()
                      .map(
                        ([roundNum, roundMatches]: [
                          string,
                          MatchWithTeams[]
                        ]) => {
                          if (roundMatches.length === 0) {
                            return null;
                          }

                          return (
                            <AccordionItem
                              key={roundNum}
                              value={`round-${groupCode}-${roundNum}`}
                              className="border-b border-muted-foreground/20 last:border-0"
                            >
                              <AccordionTrigger className="hover:bg-muted/50 px-3 rounded-md">
                                <div className="flex items-center gap-2">
                                  <span>{formatMatchRound(+roundNum)}</span>
                                  {
                                    // number available teams
                                    roundMatches.filter(
                                      (match) => match.winnerId
                                    ).length >= roundMatches.length && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        انتهت
                                      </Badge>
                                    )
                                  }
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                  {roundMatches.map((match) => (
                                    <MatchCard key={match.id} match={match} />
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        }
                      )}
                  </Accordion>
                </div>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MatchesList;
