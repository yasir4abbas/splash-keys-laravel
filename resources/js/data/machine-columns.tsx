"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { DataTableRowActions } from "@/components/table/data-table-row-actions"
import { z } from "zod"

export const machineSchema = z.object({
  id: z.number(),
  machine_id: z.string(),
  hostname: z.string().nullable(),
  fingerprint: z.string(),
  status: z.string(),
  client_id: z.number(),
  license_id: z.number(),
  platform: z.string().nullable(),
  os: z.string().nullable(),
  cpu: z.string().nullable(),
  ip: z.string().nullable(),
  client: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    position: z.string(),
    start_date: z.string(),
    access_level: z.string(),
  }).nullable(),
  license: z.object({
    id: z.number(),
    license_id: z.string(),
    license_key: z.string(),
    license_type: z.string(),
    expiration_date: z.string(),
    cost: z.string(),
    renewal_terms: z.string(),
    status: z.string(),
  }).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Machine = z.infer<typeof machineSchema>

export const createMachineColumns = (): ColumnDef<Machine>[] => [
  {
    accessorKey: "machine_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Machine ID" />
    ),
    meta: {
      title: "Machine ID",
    },
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("machine_id")}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "hostname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hostname" />
    ),
    meta: {
      title: "Hostname",
    },
    cell: ({ row }) => {
      const hostname = row.getValue("hostname") as string
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {hostname || "N/A"}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "os",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="OS" />
    ),
    meta: {
      title: "OS",
    },
    cell: ({ row }) => {
      const os = row.getValue("os") as string
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {os || "N/A"}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "platform",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Platform" />
    ),
    meta: {
      title: "Platform",
    },
    cell: ({ row }) => {
      const platform = row.getValue("platform") as string
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {platform || "N/A"}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "cpu",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPU Name" />
    ),
    meta: {
      title: "CPU Name",
    },
    cell: ({ row }) => {
      const cpu = row.getValue("cpu") as string
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {cpu || "N/A"}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "ip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP" />
    ),
    meta: {
      title: "IP",
    },
    cell: ({ row }) => {
      const ip = row.getValue("ip") as string
      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] truncate font-medium">
            {ip || "N/A"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "fingerprint",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fingerprint" />
    ),
    meta: {
      title: "Fingerprint",
    },
    cell: ({ row }) => {
      const fingerprint = row.getValue("fingerprint") as string
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-mono text-sm">
            {fingerprint.substring(0, 20)}...
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
    accessorKey: "client_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    meta: {
      title: "Client",
    },
    cell: ({ row }) => {
      const machine = row.original
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {machine.client ? machine.client.name : `Client ${machine.client_id}`}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "license_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="License" />
    ),
    meta: {
      title: "License",
    },
    cell: ({ row }) => {
      const machine = row.original
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {machine.license ? machine.license.license_key : `License ${machine.license_id}`}
          </span>
        </div>
      )
    },
  },
  
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} onDelete={() => (table.options.meta as any)?.onDelete?.(row.original)} onEdit={() => (table.options.meta as any)?.onEdit?.(row.original)} />,
  },
]

// Legacy export for backward compatibility
export const machineColumns = createMachineColumns() 