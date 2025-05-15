"use client";

import React from "react";
import { HomeIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import NavItem from "./nav-item";

const MobileNav = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/80 backdrop-blur-md shadow-md">
      <div className="flex h-16 items-center justify-around px-4 flex-row-reverse">
        <NavItem
          href="/"
          icon={HomeIcon}
          isActive={isActive("/")}
          label="Home"
        />
        <NavItem
          href="/add-tournament"
          icon={PlusIcon}
          isActive={isActive("/add-tournament")}
          label="Add Tournament"
        />
        <NavItem
          href="/settings"
          icon={SettingsIcon}
          isActive={isActive("/settings")}
          label="Settings"
        />
      </div>
    </nav>
  );
};

export default MobileNav;
