import React from "react";
import { getTournament } from "@/actions/tournament";
import {
  ArrowLeft,
  Calendar,
  Link2,
  MapPin,
  Users,
  Trophy,
  Info,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CopyButton from "@/components/copy-button";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getTournamentStatus } from "@/lib/utils";

type TournamentPageProps = {
  params: Promise<{ id: string }>;
};

const TournamentPage = async ({ params }: TournamentPageProps) => {
  const { id } = await params;

  const { data: tournament, error } = await getTournament(id);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xl text-red-600">خطأ</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-red-500">{error}</p>
              <Button asChild>
                <Link href="/">العودة للصفحة الرئيسية</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tournament) {
    return redirect("/");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const registrationUrl = `${baseUrl}/apply?id=${tournament?.id}`;
  const teamsRegistered = tournament?.teams?.length || 0;
  const { status: registrationStatus, statusColor } = getTournamentStatus(
    teamsRegistered,
    tournament?.teamCount || 0
  );
  const lastRegisterDate = formatDate(tournament?.lastRegDate);

  // Format date in Arabic style
  const formattedDate = formatDate(tournament?.startDate);

  return (
    <div className="w-full mx-auto max-w-screen-2xl flex flex-col gap-6">
      {/* Tournament Header */}
      <div className="bg-primary/5 rounded-lg p-4 flex items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{tournament?.name}</h1>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Badge className={`${statusColor} text-white`}>
              {registrationStatus}
            </Badge>
            <Badge variant="outline">
              {teamsRegistered} / {tournament?.teamCount}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tournament Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              معلومات البطولة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-start gap-3 p-3 rounded-md bg-muted/40">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">موعد البطولة</p>
                  <p className="text-sm text-muted-foreground">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Last Register Date */}
              <div className="flex items-start gap-3 p-3 rounded-md bg-muted/40">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">اخر يوم تسجيل</p>
                  <p className="text-sm text-muted-foreground">
                    {lastRegisterDate.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Location */}
              {tournament?.location && (
                <div className="flex items-start justify-between gap-3 p-3 rounded-md bg-muted/40">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">اللوكيشن</p>
                      <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {tournament.location}
                      </p>
                    </div>
                  </div>
                  <CopyButton text={tournament.location} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              التسجيل والفرق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {/* Teams */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-md bg-muted/40">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">الفرق المسجلة</p>
                    <p className="text-sm text-muted-foreground">
                      {teamsRegistered} من أصل {tournament?.teamCount} فريق
                    </p>
                  </div>
                </div>
                <Badge className={`${statusColor} text-white`}>
                  {registrationStatus}
                </Badge>
              </div>

              {/* Registration Link */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-md bg-muted/40">
                <div className="flex items-start gap-3">
                  <Link2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">رابط التسجيل</p>
                    <p className="text-sm text-muted-foreground">انقر للنسخ</p>
                  </div>
                </div>
                <CopyButton text={registrationUrl} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button asChild className="h-12" variant="default">
          <Link
            href={`/${id}/teams`}
            className="flex items-center justify-center gap-2"
          >
            <Users className="h-5 w-5" />
            <span>الفرق</span>
          </Link>
        </Button>
        <Button asChild className="h-12" variant="secondary">
          <Link
            href={`/${id}/matches`}
            className="flex items-center justify-center gap-2"
          >
            <Trophy className="h-5 w-5" />
            <span>المباريات</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TournamentPage;
