import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tournament } from "@prisma/client";
import Link from "next/link";
import React from "react";

type TournamentInfoProps = {
  tournament: Tournament;
  id: string;
};

const TournamentInfo = ({ tournament, id }: TournamentInfoProps) => {
  return (
    <div className="flex flex-col gap-2 col-span-1 bg-card p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">البطولة</h1>

        <Button variant="ghost" size="icon">
          <Link href={`/${id}`}>
            <ArrowLeft className="size-6" />
          </Link>
        </Button>
      </div>
      <p className="text-foreground ">
        اسم البطولة:{" "}
        <span className="text-muted-foreground">{tournament?.name}</span>
      </p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          {tournament?.startDate.toLocaleDateString()}
        </p>
        <span className="text-muted-foreground">-</span>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          {tournament?.endDate.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default TournamentInfo;
