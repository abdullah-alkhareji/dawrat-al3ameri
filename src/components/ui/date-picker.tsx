"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ar } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export function DatePicker({
  date,
  onDateChange,
  className,
  placeholder = "اختر التاريخ",
  disabled = false,
  fromDate,
  toDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" dir="rtl" ref={containerRef}>
      <Button
        id="date"
        variant={"outline"}
        className={cn(
          "w-full justify-start text-right font-normal",
          !date && "text-muted-foreground",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <CalendarIcon className="ml-2 h-4 w-4" />
        {date ? (
          format(date, "PPP", { locale: ar })
        ) : (
          <span>{placeholder}</span>
        )}
      </Button>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-auto rounded-md border bg-popover p-4 shadow-md"
          dir="rtl"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              onDateChange?.(date);
              setIsOpen(false);
            }}
            initialFocus
            locale={ar}
            dir="rtl"
            disabled={(date) => {
              if (fromDate && date < fromDate) return true;
              if (toDate && date > toDate) return true;
              return false;
            }}
          />
        </div>
      )}
    </div>
  );
}
