import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import LoginForm from "@/components/forms/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LoginPage = async () => {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            تسجيل الدخول
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            دخل بياناتك و حياك الله
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
