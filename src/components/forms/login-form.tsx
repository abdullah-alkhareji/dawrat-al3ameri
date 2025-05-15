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
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    const result = await executeAction({
      actionFn: async () =>
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        }),
    });

    if (!result.success) {
      setServerError(result.message || "حدث خطأ أثناء تسجيل الدخول");
      toast.error("فشل تسجيل الدخول");
    } else {
      toast.success("تم تسجيل الدخول بنجاح");
      form.reset();
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        {serverError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>الايمل</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  placeholder="مثال: example@example.com"
                />
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
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isLoading}
                    placeholder="**********"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin ml-2" />
          ) : (
            "تسجيل الدخول"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
