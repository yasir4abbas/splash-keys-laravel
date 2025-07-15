"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { DataTableRowActions } from "@/components/table/data-table-row-actions"
import { z } from "zod"

export const licenseSchema = z.object({
  id: z.number(),
  license_id: z.string(),
  license_key: z.string(),
  license_type: z.string(),
  max_count: z.number(),
  expiration_date: z.string(),
  cost: z.string(),
  renewal_terms: z.string().nullable(),
  status: z.string(),
  package_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type License = z.infer<typeof licenseSchema>

export const licenseColumns: ColumnDef<License>[] = [

  {
    accessorKey: "license_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="License ID" />
    ),
    meta: {
      title: "License ID",
    },
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("license_id")}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "license_key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="License Key" />
    ),
    meta: {
      title: "License Key",
    },
    cell: ({ row }) => {
      const licenseKey = row.getValue("license_key") as string
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-mono text-sm">
            {licenseKey.substring(0, 20)}...
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "license_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    meta: {
      title: "License Type",
    },
    cell: ({ row }) => {
      const licenseType = row.getValue("license_type") as string
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">
            {licenseType}
          </Badge>
        </div>
      )
    },
  },

  {
    accessorKey: "max_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Max Count" />
    ),
    meta: {
      title: "Max Count",
    },
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("max_count")}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "expiration_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiration" />
    ),
    meta: {
      title: "Expiration Date",
    },
    cell: ({ row }) => {
      const expirationDate = row.getValue("expiration_date") as string
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {expirationDate}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "cost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost" />
    ),
    meta: {
      title: "Cost",
    },
    cell: ({ row }) => {
      const cost = row.getValue("cost") as string
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            ${cost}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      title: "Status",
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="flex space-x-2">
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
      )
    },
  },
  
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} onDelete={() => (table.options.meta as any)?.onDelete?.(row.original)} onEdit={() => (table.options.meta as any)?.onEdit?.(row.original)} />,
  },
] 