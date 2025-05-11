"use client";

import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { executeAction } from "@/lib/executeAction";
import { toast } from "sonner";
import { loginSchema } from "@/lib/scheemas";

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    const result = await executeAction({
      actionFn: async () =>
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        }),
    });

    if (!result.success) {
      // Handle error
      console.error(result.message);
    } else {
      toast.success("تمام👌");
      form.reset();
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>الايمل</FormLabel>
              <FormControl>
                <Input {...field} type="email" autoComplete="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>كلمة السر</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          تسجيل الدخول
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
