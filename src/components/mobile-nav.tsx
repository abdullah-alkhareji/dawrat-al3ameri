"use client";

import React from "react";
import Link from "next/link";
import { HomeIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-card">
      <div className="flex h-14 items-center justify-around px-4 flex-row-reverse">
        <Link
          href="/"
          className={`flex flex-1 items-center justify-center transition-colors hover:text-primary ${
            isActive("/") ? "text-primary" : "text-muted-foreground"
          }`}
          aria-label="Home"
        >
          <HomeIcon className="size-6" />
        </Link>
        <Link
          href="/add-tournament"
          className={`flex flex-1 items-center justify-center transition-colors hover:text-primary ${
            isActive("/add-tournament")
              ? "text-primary"
              : "text-muted-foreground"
          }`}
          aria-label="Add Tournament"
        >
          <PlusIcon className="size-6" />
        </Link>
        <Link
          href="/settings"
          className={`flex flex-1 items-center justify-center transition-colors hover:text-primary ${
            isActive("/settings") ? "text-primary" : "text-muted-foreground"
          }`}
          aria-label="Settings"
        >
          <SettingsIcon className="size-6" />
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
