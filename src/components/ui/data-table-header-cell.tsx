import React from "react";

interface DataTableHeaderCellProps {
  children: React.ReactNode;
}

const DataTableHeaderCell = ({ children }: DataTableHeaderCellProps) => {
  return <div className="text-muted-foreground text-start">{children}</div>;
};

export default DataTableHeaderCell;
