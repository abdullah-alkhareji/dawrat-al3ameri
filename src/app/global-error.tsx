"use client";

import { Cairo } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorPage } from "@/components/error-boundary";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${cairo.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <ErrorPage error={error} reset={reset} />
        </ThemeProvider>
      </body>
    </html>
  );
}
