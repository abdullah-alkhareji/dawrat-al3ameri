"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Trophy,
  CheckCircle,
  Clock,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { TeamWithMatches } from "@/lib/types";

type AnimatedRegistrationSuccessProps = {
  team: TeamWithMatches;
  reviewUrl: string;
};

export default function AnimatedRegistrationSuccess({
  team,
}: AnimatedRegistrationSuccessProps) {
  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4 shadow-sm">
            <CheckCircle className="w-14 h-14 text-primary" />
          </div>
          <h1 className="text-2xl lg:text-5xl font-bold text-primary mb-3">
            تم التسجيل بنجاح! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            مبروك! تم تسجيل فريقكم
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Team Number Card */}
          <motion.div variants={item}>
            <Card className="overflow-hidden border shadow-sm">
              <div className=" p-4">
                <CardTitle className="text-xl text-primary-foreground text-center">
                  رقم فريقكم
                </CardTitle>
              </div>
              <CardContent className="text-center p-8">
                <div className="bg-muted rounded-full w-40 h-40 flex items-center justify-center mx-auto mb-6 shadow-inner border">
                  <span className="text-7xl font-bold text-primary">
                    {team.teamNumber}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3 mt-2">
                  {team.backup && (
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      <Clock className="w-4 h-4 mr-2" />
                      فريق احتياطي
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tournament Information */}
          <motion.div variants={item}>
            <Card className="shadow-sm pt-0 overflow-hidden">
              <CardHeader className="bg-muted p-4">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  معلومات البطولة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-muted-foreground font-medium">
                    اسم البطولة:
                  </span>
                  <span className="font-semibold text-lg">
                    {team.tournament.name}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
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
                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                      <MapPin className="w-4 h-4" />
                      الموقع:
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={team.tournament.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <MapPinIcon className="w-4 h-4" />
                        فتح الخريطة
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Match Schedule */}
          <motion.div variants={item}>
            <Card className="shadow-sm pt-0 overflow-hidden">
              <CardHeader className="bg-muted p-4">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  مباراتكم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="flex justify-between items-center text-center">
                  <span className="font-semibold text-center text-3xl w-full">
                    {team.matchesAsTeam1.length > 0
                      ? team.matchesAsTeam1[0].matchDate.toLocaleString("ar", {
                          weekday: "long",
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : team.matchesAsTeam2[0].matchDate.toLocaleString("ar", {
                          weekday: "long",
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Details */}
          <motion.div variants={item}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm pt-0 overflow-hidden">
                <CardHeader className="bg-muted p-4">
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    اللاعب الأول
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <span className="text-muted-foreground min-w-24">
                      الاسم:
                    </span>
                    <div className="font-semibold">{team.name1}</div>
                  </div>
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <span className="text-muted-foreground min-w-24">
                      الرقم المدني:
                    </span>
                    <div className="font-mono bg-muted p-1 px-2 rounded">
                      {team.civilId1}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground min-w-24">
                      رقم الهاتف:
                    </span>
                    <div className="font-mono bg-muted p-1 px-2 rounded">
                      {team.phone1}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm pt-0 overflow-hidden">
                <CardHeader className="bg-muted p-4">
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    اللاعب الثاني
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <span className="text-muted-foreground min-w-24">
                      الاسم:
                    </span>
                    <div className="font-semibold">{team.name2}</div>
                  </div>
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <span className="text-muted-foreground min-w-24">
                      الرقم المدني:
                    </span>
                    <div className="font-mono bg-muted p-1 px-2 rounded">
                      {team.civilId2}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground min-w-24">
                      رقم التلفون:
                    </span>
                    <div className="font-mono bg-muted p-1 px-2 rounded">
                      {team.phone2}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Important Information */}
          <motion.div variants={item} className="mt-8">
            <div className="bg-accent border rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                معلومات مهمة
              </h4>
              <Separator className="my-3" />
              <ul className="space-y-2 mt-4">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>راح نعلن عن مواعيد المباريات قبل البطولة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>تأخير نص ساعة معناته انسحاب</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>تأكد من حضور اللاعبين وقت التحضير بالبطولة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    احفظ رقم فريقك لان هذا راح يكون اسم فريقك بالبطولة
                  </span>
                </li>
                {team.backup && (
                  <li className="flex items-start gap-2 mt-3 p-3 bg-background border rounded-md">
                    <span className="mt-1 text-orange-500">•</span>
                    <span className="text-orange-500">
                      كونك فريق احتياطي، ستتم مراجعة إمكانية مشاركتك في حالة
                      انسحاب فريق آخر
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
