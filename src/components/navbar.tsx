import React from "react";
import ModeToggle from "./mode-toggle";
const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-card">
      <h1 className="text-2xl font-bold">
        دورة <span className="text-primary font-black">العميري</span>
      </h1>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
