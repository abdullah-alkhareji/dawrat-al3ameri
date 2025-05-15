import React from "react";
import ModeToggle from "./mode-toggle";
import AppLogo from "./app-logo";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { Session } from "next-auth";

const Navbar = ({ session }: { session?: Session | null }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm">
      <div className="w-full max-w-screen-2xl mx-auto flex h-16 items-center px-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <AppLogo />
          <h1 className="text-xl font-bold tracking-tight">
            بطولة <span className="text-primary font-black">العميري</span>{" "}
            للبلوت
          </h1>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-3">
          <ModeToggle />
          {session?.user && <LogoutButton />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
