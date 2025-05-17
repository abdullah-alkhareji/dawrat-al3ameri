import React from "react";
import { ClipboardX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type EmptyStateProps = {
  tournamentId: string;
  message?: string;
};

const EmptyState = ({
  tournamentId,
  message = "لا يوجد مباريات مسجلة حتى الآن",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center bg-muted/30 rounded-lg">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
        <ClipboardX className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        لا توجد مباريات
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">{message}</p>
      <Button asChild>
        <Link href={`/${tournamentId}/create-match`}>إضافة مباراة جديدة</Link>
      </Button>
    </div>
  );
};

export default EmptyState;
