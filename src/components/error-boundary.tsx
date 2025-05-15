"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return <>{children}</>;
}

export function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">
          حدث خطأ غير متوقع
        </h1>
        <p className="text-muted-foreground">
          نعتذر عن الخطأ. الرجاء المحاولة مرة أخرى.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={() => reset()}>إعادة المحاولة</Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          العودة للصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
}
