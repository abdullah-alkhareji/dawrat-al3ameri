"use client";

import React from "react";
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

const addTournamentSchema = z.object({
  name: z.string().min(1, { message: "مطلوب" }),
  teamCount: z.number({ required_error: "مطلوب" }).min(2, {
    message: "اقل شي فريقين",
  }),
  startDate: z.date({ required_error: "مطلوب" }),
  endDate: z.date({ required_error: "مطلوب" }),
  lastRegDate: z.date({ required_error: "مطلوب" }),
  location: z.string({ required_error: "مطلوب" }),
});

interface AddTournamentFormProps {
  onSuccess?: () => void;
}

const AddTournamentForm = ({ onSuccess }: AddTournamentFormProps) => {
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
      const result = await createTournament(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("تمام👌");
      form.reset();
      router.push("/");

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("ما ضبطت");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Input {...field} />
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
                      disabled={!form.watch("startDate")}
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
                      disabled={!form.watch("startDate")}
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <Button type="submit" className="w-full">
              ضيف
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddTournamentForm;
