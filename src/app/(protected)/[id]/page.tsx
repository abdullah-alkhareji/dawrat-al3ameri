import React from "react";
import { getTournament } from "@/actions/tournament";
import { ArrowLeft, Calendar, Link2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CopyButton from "@/components/copy-button";

const TournamentPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const { data: tournament, error } = await getTournament(id);
  if (error) {
    return <div>{error}</div>;
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tournament?.name}</h1>
        <Button variant="ghost" size="icon">
          <Link href="/">
            <ArrowLeft className="size-6" />
          </Link>
        </Button>
      </div>
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
      <div className="flex items-center gap-2 justify-between">
        <p className="text-sm text-muted-foreground flex items-center gap-2 max-w-full truncate overflow-ellipsis whitespace-nowrap">
          <MapPin className="size-4 text-primary" />
          {tournament?.location}
        </p>
        {tournament?.location && <CopyButton text={tournament?.location} />}
      </div>
      <div className="flex items-center gap-2 justify-between">
        <p className="text-sm text-muted-foreground flex items-center gap-2 max-w-full truncate overflow-ellipsis whitespace-nowrap">
          <Link2 className="size-4 text-primary" />
          رابط التسجيل
        </p>
        {tournament?.name && (
          <CopyButton text={`${baseUrl}/apply?id=${tournament?.id}`} />
        )}
      </div>
    </div>
  );
};

export default TournamentPage;
