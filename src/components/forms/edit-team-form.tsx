"use client";

import { useTeam } from "@/hooks/use-team";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { editTeamSchema } from "@/lib/scheemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Loader from "../loader";
import { updateTeam } from "@/actions/teams";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type EditTeamFormProps = {
  teamId: string;
};

const EditTeamForm = ({ teamId }: EditTeamFormProps) => {
  const { team, isLoading, error } = useTeam(teamId);
  const router = useRouter();

  const form = useForm<z.infer<typeof editTeamSchema>>({
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      name1: "",
      name2: "",
      civilId1: "",
      civilId2: "",
      phone1: "",
      phone2: "",
    },
  });

  useEffect(() => {
    if (team) {
      form.reset({
        name1: team.name1,
        name2: team.name2,
        civilId1: team.civilId1,
        civilId2: team.civilId2,
        phone1: team.phone1,
        phone2: team.phone2,
      });
    }
  }, [team, form]);

  const onSubmit = async (values: z.infer<typeof editTeamSchema>) => {
    const { success, error } = await updateTeam(teamId, values);
    if (success) {
      toast.success("تم تعديل الفريق بنجاح");
      router.push(`/${team?.tournamentId}/teams`);
    } else {
      toast.error(error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>{error}</div>;
  // if (!team) return <div>Team not found</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Player 1 Fields */}
          <div className="col-span-1 p-4 border rounded-md flex flex-col gap-8">
            <FormField
              control={form.control}
              name="name1"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>الاسم الثلاثي لللاعب الاول</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="civilId1"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>الرقم المدني لللاعب الاول</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.replace(/\D/g, ""));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone1"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>رقم التلفون لللاعب الاول</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.replace(/\D/g, ""));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Player 2 Fields */}
          <div className="col-span-1 p-4 border rounded-md flex flex-col gap-8">
            <FormField
              control={form.control}
              name="name2"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>الاسم الثلاثي لللاعب الثاني</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="civilId2"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>الرقم المدني لللاعب الثاني</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.replace(/\D/g, ""));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone2"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>رقم التلفون لللاعب الثاني</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.replace(/\D/g, ""));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="col-span-1 lg:col-span-2">
            تعديل
          </Button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </Form>
  );
};

export default EditTeamForm;
