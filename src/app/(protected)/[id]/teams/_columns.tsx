"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Team } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash, Pencil } from "lucide-react";
import DataTableHeaderCell from "@/components/ui/data-table-header-cell";
import { deleteTeam } from "@/actions/teams";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const handleDeleteTeam = async (id: string) => {
  const { success, error } = await deleteTeam(id);
  if (success) {
    toast.success("تم حذف الفريق بنجاح");
  } else {
    toast.error(error || "حدث خطأ أثناء حذف الفريق");
  }
};

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "teamNumber",
    header: () => <DataTableHeaderCell>ر.ف</DataTableHeaderCell>,
    cell: ({ row }) => {
      const { backup } = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>{row.original.teamNumber}</span>
          {backup && <Badge variant="default">احتياطي</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "name1",
    header: () => <DataTableHeaderCell>اسم اللاعب الاول</DataTableHeaderCell>,
  },
  {
    accessorKey: "civilId1",
    header: () => (
      <DataTableHeaderCell>الرقم المدني الاعب الاول</DataTableHeaderCell>
    ),
  },
  {
    accessorKey: "phone1",
    header: () => (
      <DataTableHeaderCell>رقم تلفون لاعب الاول</DataTableHeaderCell>
    ),
  },
  {
    accessorKey: "name2",
    header: () => <DataTableHeaderCell>اسم اللاعب الثاني</DataTableHeaderCell>,
  },
  {
    accessorKey: "civilId2",
    header: () => (
      <DataTableHeaderCell>الرقم المدني الاعب الثاني</DataTableHeaderCell>
    ),
  },
  {
    accessorKey: "phone2",
    header: () => (
      <DataTableHeaderCell>رقم تلفون لاعب الثاني</DataTableHeaderCell>
    ),
  },
  {
    id: "actions",
    header: () => <DataTableHeaderCell>العمليات</DataTableHeaderCell>,
    cell: ({ row }) => {
      const team = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => console.log(team.id)}>
              تعديل الفريق
              <Pencil className="h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleDeleteTeam(team.id)}
            >
              حذف الفريق
              <Trash className="h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
