"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const selectButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-14 px-6",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
);

interface SelectButtonItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof selectButtonVariants> {
  value: string | number;
  selected?: boolean;
}

const SelectButtonItem = React.forwardRef<
  HTMLButtonElement,
  SelectButtonItemProps
>(({ className, size, value, selected, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      data-state={selected ? "selected" : "unselected"}
      data-value={value}
      data-slot="select-button-item"
      className={cn(
        selectButtonVariants({
          variant: selected ? "default" : "outline",
          size,
          className,
        })
      )}
      {...props}
    >
      {children || value}
    </button>
  );
});
SelectButtonItem.displayName = "SelectButtonItem";

// For backward compatibility
const SelectButton = SelectButtonItem;

interface SelectButtonRootProps {
  children?: React.ReactNode;
  value: string | number;
  onValueChange?: (value: string | number) => void;
  disabled?: boolean;
  defaultValue?: string | number;
  size?: "default" | "sm" | "lg";
}

function SelectButtonRoot({
  children,
  value,
  onValueChange,
  disabled,
  size = "default",
  ...props
}: SelectButtonRootProps) {
  return (
    <div
      data-slot="select-button-root"
      className="grid grid-cols-4 gap-2"
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<SelectButtonItemProps>(child)) {
          return React.cloneElement(child, {
            selected: child.props.value === value,
            onClick: () => onValueChange?.(child.props.value),
            disabled,
            size,
          });
        }
        return child;
      })}
    </div>
  );
}

interface SelectButtonGroupProps {
  options: Array<string | number>;
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
}

const SelectButtonGroup = React.forwardRef<
  HTMLDivElement,
  SelectButtonGroupProps
>(
  (
    {
      className,
      options,
      value,
      onChange,
      disabled,
      size = "default",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap gap-2", className)}
        data-slot="select-button-group"
        {...props}
      >
        {options.map((option) => (
          <SelectButtonItem
            key={option.toString()}
            value={option}
            selected={value === option}
            onClick={() => onChange(option)}
            disabled={disabled}
            size={size}
          >
            {option}
          </SelectButtonItem>
        ))}
      </div>
    );
  }
);
SelectButtonGroup.displayName = "SelectButtonGroup";

export {
  SelectButtonRoot,
  SelectButtonItem,
  SelectButton,
  SelectButtonGroup,
  selectButtonVariants,
};
