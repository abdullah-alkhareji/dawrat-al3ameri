// src/app/(public)/registration-success/page.tsx

import React from "react";
import { getTeam } from "@/actions/teams";
import { redirect } from "next/navigation";
import { Calendar, MapPin, Users, Trophy, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CopyButton from "@/components/copy-button";
import Link from "next/link";

type RegistrationSuccessPageProps = {
  searchParams: Promise<{ id: string }>;
};

const RegistrationSuccessPage = async ({ searchParams }: RegistrationSuccessPageProps) => {
  const { id } = await searchParams;

  if (!id) {
    redirect("/");
  }

  const { data: team, error } = await getTeam(id);

  if (error || !team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-destructive text-2xl font-bold mb-4">
              {error || "الفريق غير موجود"}
            </div>
            <Button asChild variant="outline">
              <Link href="/">العودة للرئيسية</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reviewUrl = `${baseUrl}/review?id=${team.id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
            تم التسجيل بنجاح! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            مبروك! فريقكم مسجل في البطولة
          </p>
        </div>

        {/* Team Number Card */}
        <Card className="mb-6 border-green-200 dark:border-green-800">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-muted-foreground">
              رقم فريقكم
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
              <span className="text-6xl font-bold text-green-600 dark:text-green-400">
                {team.teamNumber}
              </span>
            </div>
            {team.backup ? (
              <Badge variant="secondary" className="text-base">
                <Clock className="w-4 h-4 mr-2" />
                فريق احتياطي
              </Badge>
            ) : (
              <Badge variant="default" className="text-base">
                <Trophy className="w-4 h-4 mr-2" />
                مشارك أساسي
              </Badge>
            )}
            {team.groupCode && (
              <div className="mt-4">
                <Badge variant="outline" className="text-base">
                  <Users className="w-4 h-4 mr-2" />
                  مجموعة: {team.groupCode}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              معلومات البطولة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">اسم البطولة:</span>
              <span className="font-semibold">{team.tournament.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                تاريخ البداية:
              </span>
              <span className="font-semibold">
                {team.tournament.startDate.toLocaleDateString("ar", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {team.tournament.location && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  الموقع:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">انقر لفتح الخريطة</span>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={team.tournament.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      فتح الخريطة
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>اللاعب الأول</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">الاسم:</span>
                <div className="font-semibold">{team.name1}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">الرقم المدني:</span>
                <div className="font-mono">{team.civilId1}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">رقم الهاتف:</span>
                <div className="font-mono">{team.phone1}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>اللاعب الثاني</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">الاسم:</span>
                <div className="font-semibold">{team.name2}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">الرقم المدني:</span>
                <div className="font-mono">{team.civilId2}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">رقم الهاتف:</span>
                <div className="font-mono">{team.phone2}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  احفظ معلومات فريقك
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  انسخ رابط مراجعة بيانات الفريق لمراجعتها لاحقاً
                </p>
                <div className="flex items-center justify-center gap-2 bg-muted p-3 rounded-lg">
                  <span className="text-sm font-mono truncate">{reviewUrl}</span>
                  <CopyButton text={reviewUrl} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="flex items-center gap-2">
                  <Link href={`/review?id=${team.id}`}>
                    <CheckCircle className="w-4 h-4" />
                    مراجعة بيانات الفريق
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/">
                    العودة للرئيسية
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              معلومات مهمة
            </h4>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• سيتم الإعلان عن مواعيد المباريات قبل البطولة</li>
              <li>• تأكد من حضورك في الوقت المحدد للمباريات</li>
              <li>• احتفظ برقم فريقك ورابط المراجعة</li>
              {team.backup && (
                <li className="text-orange-600 dark:text-orange-400">
                  • كونك فريق احتياطي، ستتم مراجعة إمكانية مشاركتك في حالة انسحاب فريق آخر
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;