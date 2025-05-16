"use client";

import React from "react";
import { Button } from "./ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/hooks/use-component-state";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
}

const CopyButton = ({ text, className }: CopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    copy(text);
    toast.success("تم النسخ");
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className={cn(className)}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
};

export default CopyButton;
export type { CopyButtonProps };
