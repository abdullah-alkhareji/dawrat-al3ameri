import React from "react";
import { getTournament } from "@/actions/tournament";
import {
  ArrowLeft,
  Calendar,
  Link2,
  MapPin,
  Users,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CopyButton from "@/components/copy-button";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
// import TournamentNotFound from "./not-found";

type TournamentPageProps = {
  params: Promise<{ id: string }>;
};

const TournamentPage = async ({ params }: TournamentPageProps) => {
  const { id } = await params;

  const { data: tournament, error } = await getTournament(id);
  if (error) {
    return <div>{error}</div>;
  }
  if (!tournament) {
    return redirect("/");
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
      <div className="flex items-center gap-2 p-2">
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
      <div className="flex items-center gap-2 justify-between p-2">
        <p className="text-sm text-muted-foreground flex items-center gap-2 max-w-full truncate overflow-ellipsis whitespace-nowrap">
          <Users className="size-4 text-primary" />
          الفرق المتسجلة
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-2 max-w-full truncate overflow-ellipsis whitespace-nowrap">
          {tournament?.teamCount} / {tournament?.teams?.length}
        </p>
      </div>
      <div className="flex items-center gap-2 justify-between p-2">
        <p className="text-sm text-muted-foreground flex items-center gap-2 max-w-full truncate overflow-ellipsis whitespace-nowrap">
          <MapPin className="size-4 text-primary" />
          اللوكيشن
        </p>
        {tournament?.location && <CopyButton text={tournament?.location} />}
      </div>
      <div className="flex items-center gap-2 justify-between p-2">
        <p className="text-sm text-muted-foreground flex items-center gap-2 max-w-full truncate overflow-ellipsis whitespace-nowrap">
          <Link2 className="size-4 text-primary" />
          رابط التسجيل
        </p>
        {tournament?.name && (
          <CopyButton text={`${baseUrl}/apply?id=${tournament?.id}`} />
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <Button variant="outline" asChild>
          <Link href={`/${id}/teams`}>
            <Users className="size-4" />
            الفرق
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/${id}/matches`}>
            <Trophy className="size-4" />
            المباريات
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TournamentPage;
