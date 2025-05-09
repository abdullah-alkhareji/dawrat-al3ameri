"use client";

import React from "react";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
interface CopyButtonProps {
  text: string;
}

const CopyButton = ({ text }: CopyButtonProps) => {
  const handleCopy = () => {
    // Create a temporary input element
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);

    // Select and copy the text
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");

    // Clean up
    document.body.removeChild(tempInput);
    toast.success("تم النسخ");
  };

  return (
    <div>
      <Button variant="ghost" size="icon" onClick={handleCopy}>
        <Copy className="size-3" />
      </Button>
    </div>
  );
};

export default CopyButton;
