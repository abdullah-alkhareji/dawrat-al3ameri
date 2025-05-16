import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "بطولة العميري للبلوت",
  description: "منصة لإدارة بطولات البلوت وتنظيم المباريات والفرق والجوائز",
  keywords: ["بلوت", "بطولة", "العميري", "كويت", "سعودية", "مسابقات", "كارت"],
  authors: [{ name: "Abdullah AlKhareji" }],
  creator: "Abdullah AlKhareji",
  publisher: "Abdullah AlKhareji",
  formatDetection: {
    email: true,
    telephone: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/assets/PNG/logo-black.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/assets/PNG/logo-black.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [{ url: "/assets/PNG/logo-black.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cairo.variable}
    >
      <body className={`${cairo.className} antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <Toaster />
            <main className="flex flex-col min-h-screen">{children}</main>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
