import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const AddTournamentButton = () => {
  const [isAddTournamentPage, setIsAddTournamentPage] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsAddTournamentPage(pathname === "/add-tournament");
  }, [pathname]);

  if (isAddTournamentPage) {
    return null;
  }

  return (
    <Button
      variant="default"
      className={cn(
        "fixed bottom-4 right-4 size-16 rounded-full hidden lg:flex"
      )}
      asChild
    >
      <Link href="/add-tournament">
        <Plus className="size-6" />
      </Link>
    </Button>
  );
};

export default AddTournamentButton;
