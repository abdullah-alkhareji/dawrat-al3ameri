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
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <div className="mb-8 text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">
          بطولة العميري للبلوت
        </h1>
        <p className="text-muted-foreground">منصة تسجيل المتسابقين</p>
      </div>

      <Card className="w-full max-w-md border-primary/20 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            تسجيل الدخول
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            أدخل بياناتك وحياك الله
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
