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
  machines: z.array(z.object({
    id: z.number(),
    machine_id: z.string(),
    hostname: z.string().nullable(),
    status: z.string(),
    platform: z.string().nullable(),
    os: z.string().nullable(),
    ip: z.string().nullable(),
  })).optional(),
  licenses: z.array(z.object({
    id: z.number(),
    license_id: z.string(),
    license_key: z.string(),
    license_type: z.string(),
    expiration_date: z.string(),
    cost: z.string(),
    renewal_terms: z.string(),
    status: z.string(),
  })).optional(),
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
    accessorKey: "machines",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Machines" />
    ),
    meta: {
      title: "Machines",
    },
    cell: ({ row }) => {
      const client = row.original as any;
      const machines = client.machines || [];
      
      if (machines.length === 0) {
        return (
          <div className="text-gray-400 text-sm">
            No machines
          </div>
        )
      }
      
      return (
        <div className="flex flex-wrap gap-1">
          {machines.slice(0, 3).map((machine: any, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {machine.hostname || machine.machine_id}
            </Badge>
          ))}
          {machines.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{machines.length - 3} more
            </Badge>
          )}
        </div>
      )
    },
  },

  {
    accessorKey: "licenses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Licenses" />
    ),
    meta: {
      title: "Licenses",
    },
    cell: ({ row }) => {
      const client = row.original as any;
      const licenses = client.licenses || [];
      
      if (licenses.length === 0) {
        return (
          <div className="text-gray-400 text-sm">
            No licenses
          </div>
        )
      }
      
      return (
        <div className="flex flex-wrap gap-1">
          {licenses.slice(0, 3).map((license: any, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {license.license_key}
            </Badge>
          ))}
          {licenses.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{licenses.length - 3} more
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
