// src/app/(public)/review/page.tsx

import React from "react";
import { getTeam } from "@/actions/teams";
import { redirect } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";

type ReviewPageProps = {
  searchParams: Promise<{ id: string }>;
};

const ReviewPage = async ({ searchParams }: ReviewPageProps) => {
  const { id } = await searchParams;

  if (!id) {
    redirect("/");
  }

  const { data: team, error } = await getTeam(id);

  if (error) {
    return (
      <div className="text-center text-2xl font-bold flex flex-col items-center justify-center h-full">
        {error}
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center text-2xl font-bold flex flex-col items-center justify-center h-full">
        الفريق مو موجود
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-3xl lg:text-5xl font-bold text-center ">كبجرها 💾</h1>
      <div className="flex flex-col items-center justify-center gap-4 bg-card rounded-lg ">
        <h3 className="text-center">فريقك رقم</h3>
        <div className="flex justify-center">
          <h1 className="text-9xl font-bold text-center mb-4">
            {team?.teamNumber}
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-2 col-span-1 bg-card p-4 rounded-lg">
        <h1 className="text-xl font-bold">البطولة</h1>
        <p className="text-foreground ">
          اسم البطولة:{" "}
          <span className="text-muted-foreground">
            {team?.tournament?.name}
          </span>
        </p>
        {team?.groupCode && (
          <p className="text-muted-foreground text-center text-sm">
            راح تلعب في مجموعة:{" "}
            <span className="font-bold">{team.groupCode}</span>
          </p>
        )}
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            {team?.tournament?.startDate.toLocaleDateString()}
          </p>
          <span className="text-muted-foreground">-</span>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            {team?.tournament?.endDate.toLocaleDateString()}
          </p>
        </div>
        {team?.tournament?.location && (
          <p className="text-foreground flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <a
              href={team?.tournament?.location}
              target="_blank"
              className="text-muted-foreground"
            >
              {team?.tournament?.location}
            </a>
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 col-span-1 bg-card p-4 rounded-lg">
          <h1 className="text-xl font-bold">اللاعب الأول</h1>
          <p className="text-foreground ">
            الاسم: <span className="text-muted-foreground">{team?.name1}</span>
          </p>
          <p className="text-foreground ">
            الرقم المدني:{" "}
            <span className="text-muted-foreground">{team?.civilId1}</span>
          </p>
          <p className="text-foreground ">
            رقم التلفون:{" "}
            <span className="text-muted-foreground">{team?.phone1}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 col-span-1 bg-card p-4 rounded-lg">
          <h1 className="text-xl font-bold">اللاعب الثاني</h1>
          <p className="text-foreground ">
            الاسم: <span className="text-muted-foreground">{team?.name2}</span>
          </p>
          <p className="text-foreground ">
            الرقم المدني:{" "}
            <span className="text-muted-foreground">{team?.civilId2}</span>
          </p>
          <p className="text-foreground ">
            رقم التلفون:{" "}
            <span className="text-muted-foreground">{team?.phone2}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
