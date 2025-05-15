"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  isActive,
  label,
}) => {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center transition-colors hover:text-primary relative ${
        isActive ? "text-foreground" : "text-muted-foreground"
      }`}
      aria-label={label}
    >
      <Icon
        className={`size-6 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`}
      />
      {isActive && (
        <span className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
      )}
    </Link>
  );
};

export default NavItem;
