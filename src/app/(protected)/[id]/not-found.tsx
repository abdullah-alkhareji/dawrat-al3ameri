import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const TournamentNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <p className="text-muted-foreground text-2xl">البطولة غير موجودة</p>
      <Button variant="secondary" asChild>
        <Link href="/">
          الرجوع
          <ArrowLeft className="size-4" />
        </Link>
      </Button>
    </div>
  );
};

export default TournamentNotFound;
