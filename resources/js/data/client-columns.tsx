"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

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
    accessorKey: "hostnames",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hostnames" />
    ),
    meta: {
      title: "Hostnames",
    },
    cell: ({ row }) => {
      const client = row.original as any;
      const hostnames = client.hostnames || [];
      
      if (hostnames.length === 0) {
        return (
          <div className="text-gray-400 text-sm">
            No hostnames
          </div>
        )
      }
      
      return (
        <div className="flex flex-wrap gap-1">
          {hostnames.slice(0, 3).map((hostname: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {hostname}
            </Badge>
          ))}
          {hostnames.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{hostnames.length - 3} more
            </Badge>
          )}
        </div>
      )
    },
  },
  
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} onDelete={() => (table.options.meta as any)?.onDelete?.(row.original)} onEdit={() => (table.options.meta as any)?.onEdit?.(row.original)} />,
  },
]
