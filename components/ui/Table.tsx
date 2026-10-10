import type { ReactNode } from "react";
import type { ThHTMLAttributes, TdHTMLAttributes, HTMLAttributes } from "react";

export function Table({ className = "", ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full border-collapse text-sm ${className}`}
        {...props}
      />
    </div>
  );
}

export function TableHead({ className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`bg-muted/70 text-left text-xs uppercase tracking-wide text-muted-foreground ${className}`}
      {...props}
    />
  );
}

export function TableBody({ className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />;
}

export function TableRow({ className = "", ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-b border-border last:border-0 hover:bg-muted/40 ${className}`}
      {...props}
    />
  );
}

export function TableHeadCell({ className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`px-4 py-3 font-semibold ${className}`} {...props} />;
}

export function TableCell({ className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-4 py-3 align-middle ${className}`} {...props} />;
}

export function Money({ value, className = "" }: { value: number; className?: string }) {
  const formatted = `Rs. ${Math.round(value).toLocaleString("en-US")}`;
  return (
    <span className={`whitespace-nowrap font-mono tabular-nums ${className}`}>
      {formatted}
    </span>
  );
}