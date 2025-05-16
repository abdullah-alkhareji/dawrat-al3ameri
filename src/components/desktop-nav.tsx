"use client";

import React, { useState, useEffect } from "react";
import { HomeIcon, PlusIcon, SettingsIcon, MenuIcon, X } from "lucide-react";
import { usePathname } from "next/navigation";
import NavItem from "./nav-item";
import { cn } from "@/lib/utils";

const DesktopNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddTournamentPage, setIsAddTournamentPage] = useState(false);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    setIsAddTournamentPage(pathname === "/add-tournament");
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Don't show on add tournament page
  if (isAddTournamentPage) {
    return null;
  }

  return (
    <div className="hidden lg:block fixed bottom-6 right-6 z-50">
      {/* Menu Items */}
      <div
        className={cn(
          "absolute bottom-16 right-0 flex flex-col gap-4 items-center transition-all duration-300 transform",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        <div className="bg-background/80 backdrop-blur-md p-3 rounded-full shadow-md border border-border/40">
          <NavItem
            href="/"
            icon={HomeIcon}
            isActive={isActive("/")}
            label="Home"
          />
        </div>
        <div className="bg-background/80 backdrop-blur-md p-3 rounded-full shadow-md border border-border/40">
          <NavItem
            href="/add-tournament"
            icon={PlusIcon}
            isActive={false}
            label="Add Tournament"
          />
        </div>
        <div className="bg-background/80 backdrop-blur-md p-3 rounded-full shadow-md border border-border/40">
          <NavItem
            href="/settings"
            icon={SettingsIcon}
            isActive={isActive("/settings")}
            label="Settings"
          />
        </div>
      </div>

      {/* Toggle/Action Button */}
      <button
        onClick={toggleMenu}
        className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="size-6" /> : <MenuIcon className="size-6" />}
      </button>
    </div>
  );
};

export default DesktopNav;
