"use client";

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
import { toast } from "sonner";
import { registerSchema } from "@/lib/scheemas";
import { register } from "@/actions/auth";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);

    const result = await register(values);

    if (!result.success) {
      setServerError(result.message || "في شي غلط");
      toast.error("فشل تسجيل الحساب");
    } else {
      toast.success("تم التسجيل بنجاح");
      form.reset();
      router.push("/login");
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
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  autoComplete="name"
                  disabled={isLoading}
                  placeholder="اسمك ابوك العايلة"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>الايميل</FormLabel>
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
                    autoComplete="new-password"
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin ml-2" />
          ) : (
            "تسجيل حساب جديد"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
