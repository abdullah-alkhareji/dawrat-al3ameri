"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import React from "react";
import { LogOutIcon } from "lucide-react";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        variant="ghost"
        size="icon"
        className="text-destructive"
      >
        <LogOutIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default LogoutButton;
