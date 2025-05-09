import React from "react";
import Navbar from "@/components/navbar";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 pt-4 pb-20 lg:pb-4">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
