import React from "react";
import ModeToggle from "./mode-toggle";
import AppLogo from "./app-logo";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { Session } from "next-auth";

const Navbar = ({ session }: { session?: Session | null }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b px-4 py-4">
      <div className="w-full max-w-screen-2xl mx-auto flex h-14 items-center ">
        <Link href="/" className="flex items-center gap-2">
          <AppLogo />
          <h1 className="text-xl font-bold tracking-tight">
            بطولة <span className="text-primary font-black">العميري</span>{" "}
            للبلوت
          </h1>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-2">
          <ModeToggle />
          {session?.user && <LogoutButton />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
