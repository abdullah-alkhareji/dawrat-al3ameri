import React from "react";
import ModeToggle from "./mode-toggle";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b px-4">
      <div className="container flex h-14 items-center mx-auto ">
        <h1 className="text-2xl font-bold tracking-tight">
          دورة <span className="text-primary font-black">العميري</span>
        </h1>
        <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
