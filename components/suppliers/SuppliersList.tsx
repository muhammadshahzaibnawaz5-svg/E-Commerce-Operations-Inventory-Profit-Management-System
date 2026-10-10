"use client";

import Link from "next/link";
import { getSuppliers } from "@/lib/suppliers";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { IconStore } from "@/components/ui/icons";

export function SuppliersList() {
  const suppliers = getSuppliers();

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Supplier</TableHeadCell>
              <TableHeadCell>Contact</TableHeadCell>
              <TableHeadCell className="text-right">Total purchased</TableHeadCell>
              <TableHeadCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No suppliers yet.
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <span className="flex items-center gap-2 font-semibold text-foreground">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconStore width={16} height={16} />
                      </span>
                      {s.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.contact}</TableCell>
                  <TableCell className="text-right"><Money value={s.totalPurchased} /></TableCell>
                  <TableCell className="text-right">
                    <Link href={`/suppliers/${s.id}`} className="text-sm font-medium text-primary hover:text-primary-hover">
                      View history
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}