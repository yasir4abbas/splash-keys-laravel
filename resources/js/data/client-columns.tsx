"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { DataTableRowActions } from "@/components/table/data-table-row-actions"
import { z } from "zod"

export const clientSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  position: z.string(),
  start_date: z.string(),
  access_level: z.string(),
  created_at: z.string(),
})

export type Client = z.infer<typeof clientSchema>

export const clientColumns: ColumnDef<Client>[] = [

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
    meta: {
      title: "Name",
    },
    cell: ({ row }) => {
    //   const label = labels.find((label) => label.value === row.original.label)
      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
                {row.getValue("name")}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    meta: {
      title: "Email",
    },
    cell: ({ row }) => {
    //   const label = labels.find((label) => label.value === row.original.label)
      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
                {row.getValue("email")}
          </span>
        </div>
      )
    },
  },
  
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} onDelete={() => table.options.meta?.onDelete?.(row.original)} onEdit={() => table.options.meta?.onEdit?.(row.original)} />,
  },
]
