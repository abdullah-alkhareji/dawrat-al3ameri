import React from "react";
import { getTeam } from "@/actions/teams";
import { redirect } from "next/navigation";

const ReviewPage = async ({
  searchParams,
}: {
  searchParams: { id: string };
}) => {
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
        الفريق غير موجود
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-3xl lg:text-5xl font-bold text-center mb-4">
        كبجرها 💾
      </h1>
      <div className="flex flex-col items-center justify-center gap-4 bg-card p-4 rounded-lg ">
        <h3 className="text-center">فريقك رقم</h3>
        <div className="flex justify-center">
          <h1 className="text-9xl font-bold text-center mb-4">
            {team?.teamNumber}
          </h1>
        </div>
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
