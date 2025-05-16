"use client";

import React from "react";
import { Button } from "./ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/hooks/use-component-state";

interface CopyButtonProps {
  text: string;
}

const CopyButton = ({ text }: CopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    copy(text);
    toast.success("تم النسخ");
  };

  return (
    <div>
      <Button variant="ghost" size="icon" onClick={handleCopy}>
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </Button>
    </div>
  );
};

export default CopyButton;
