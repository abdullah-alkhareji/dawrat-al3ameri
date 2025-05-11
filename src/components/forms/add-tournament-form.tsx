"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { DatePicker } from "../ui/date-picker";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTournament } from "@/actions/tournament";
import { addTournamentSchema } from "@/lib/scheemas";
import { Loader2 } from "lucide-react";
const AddTournamentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof addTournamentSchema>>({
    resolver: zodResolver(addTournamentSchema),
    defaultValues: {
      name: "",
      teamCount: 2,
      startDate: undefined,
      endDate: undefined,
      lastRegDate: undefined,
      location: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof addTournamentSchema>) => {
    try {
      setIsLoading(true);
      const result = await createTournament(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("تمام👌");
      form.reset();
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("ما ضبطت");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="col-span-1 p-4 border rounded-md">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم البطولة</FormLabel>
                  <FormDescription>
                    اسم البطولة الي راح يطلع حق الكل
                  </FormDescription>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 p-4 border rounded-md">
            <FormField
              control={form.control}
              name="teamCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد الفرق</FormLabel>
                  <FormDescription>لازم يكون عدد الفرق زوجي</FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      min={2}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      step={2}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 p-4 border rounded-md">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تبلش</FormLabel>
                  <FormDescription>اول يوم للبطولة</FormDescription>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 p-4 border rounded-md">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>لي</FormLabel>
                  <FormDescription>اخر يوم للبطولة</FormDescription>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      disabled={isLoading || !form.watch("startDate")}
                      fromDate={form.watch("startDate")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 p-4 border rounded-md">
            <FormField
              control={form.control}
              name="lastRegDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اخر يوم تسجيل</FormLabel>
                  <FormDescription>
                    اخر يوم الفرق يقدرون يسجلون فيه
                  </FormDescription>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      disabled={isLoading || !form.watch("startDate")}
                      toDate={form.watch("startDate")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 p-4 border rounded-md">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المكان</FormLabel>
                  <FormDescription>
                    اللوكيشن تسوي كوبي حق اللنك من قوقل ماب
                  </FormDescription>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>جاري الإضافة...</span>
            </div>
          ) : (
            "ضيف"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddTournamentForm;
