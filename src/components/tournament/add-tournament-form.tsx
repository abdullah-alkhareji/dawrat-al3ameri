"use client";

import React from "react";
import {
  Form,
  FormControl,
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
  name: z.string().min(1, { message: "اسم البطولة مطلوب" }),
  teamCount: z.number().min(2, { message: "عدد الفرق مطلوب" }),
  startDate: z.date(),
  endDate: z.date(),
  lastRegDate: z.date(),
  location: z.string(),
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

      toast.success("تم إنشاء البطولة بنجاح");
      form.reset();
      router.refresh();

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إنشاء البطولة");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم البطولة</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teamCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عدد الفرق</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={2}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تاريخ البدء</FormLabel>
              <FormControl>
                <DatePicker date={field.value} onDateChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تاريخ الانتهاء</FormLabel>
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

        <FormField
          control={form.control}
          name="lastRegDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تاريخ التسجيل النهائي</FormLabel>
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

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الموقع</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          اضافة بطولة
        </Button>
      </form>
    </Form>
  );
};

export default AddTournamentForm;
