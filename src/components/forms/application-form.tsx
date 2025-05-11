"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { applicationFormSchema } from "@/lib/scheemas";
import React, { useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createTeam } from "@/actions/teams";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ApplicationForm = ({
  tournamentId,
}: {
  teamsCount: number;
  tournamentId: string;
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof applicationFormSchema>>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      name1: "",
      name2: "",
      civilId1: "",
      civilId2: "",
      phone1: "",
      phone2: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof applicationFormSchema>) => {
    try {
      const result = await createTeam(values, tournamentId);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("مبروك, تسجل في البطولة👌");
      form.reset();
      setError(null);
      router.push(`/review?id=${result.data?.id}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "صار شي غلط";
      toast.error(errorMessage);
      setError(errorMessage);
      console.log(error);
    }
  };

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
          <Button type="submit" className="col-span-1 lg:col-span-3">
            تسجيل
          </Button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </Form>
  );
};

export default ApplicationForm;
