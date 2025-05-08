import Navbar from "@/components/navbar";
import MobileNav from "@/components/mobile-nav";
import React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-4 pb-20 md:pb-4">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
};

export default ProtectedLayout;
