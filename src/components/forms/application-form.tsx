"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { applicationFormSchema } from "@/lib/scheemas";
import React from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ApplicationForm = ({ teamsCount }: { teamsCount: number }) => {
  const form = useForm<z.infer<typeof applicationFormSchema>>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      teamNumber: teamsCount + 1,
      name1: "",
      name2: "",
      civilId1: 0,
      civilId2: 0,
      phone1: 0,
      phone2: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof applicationFormSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Player 1 Fields */}
          <div className="col-span-1 p-4 border rounded-md flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الثلاثي</FormLabel>
                  <FormDescription>اللاعب الاول</FormDescription>
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
                <FormItem>
                  <FormLabel>الرقم المدني</FormLabel>
                  <FormDescription>اللاعب الاول</FormDescription>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم التلفون</FormLabel>
                  <FormDescription>اللاعب الاول</FormDescription>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Player 2 Fields */}
          <div className="col-span-1 p-4 border rounded-md flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الثلاثي</FormLabel>
                  <FormDescription>اللاعب الثاني</FormDescription>
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
                <FormItem>
                  <FormLabel>الرقم المدني</FormLabel>
                  <FormDescription>اللاعب الثاني</FormDescription>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم التلفون</FormLabel>
                  <FormDescription>اللاعب الثاني</FormDescription>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Empty div for grid alignment on desktop */}
          <div className="col-span-1"></div>
          {/* Submit Button */}
          <Button type="submit" className="col-span-1 lg:col-span-3">
            تسجيل
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicationForm;
