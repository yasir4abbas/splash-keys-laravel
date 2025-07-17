import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "@/components/table/data-table-row-actions"

export const packageColumns: ColumnDef<any>[] = [
  {
    accessorKey: "package_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Package ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "package_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Package Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "version",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Version
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-[200px] truncate" title={description}>
          {description}
        </div>
      )
    },
  },
  {
    accessorKey: "support_contact",
    header: "Support Contact",
    cell: ({ row }) => {
      const supportContact = row.getValue("support_contact") as string
      return (
        <div className="max-w-[150px] truncate" title={supportContact}>
          {supportContact}
        </div>
      )
    },
  },
  {
    accessorKey: "meta",
    header: "Metadata",
    cell: ({ row }) => {
      const packageItem = row.original
      const metadata = packageItem.meta || []
      
      if (metadata.length === 0) {
        return (
          <div className="text-gray-400 text-sm">
            No metadata
          </div>
        )
      }
      
      return (
        <div className="space-y-1">
          {metadata.slice(0, 3).map((meta: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <span className="font-medium text-gray-600 min-w-0 truncate">
                {meta.key}:
              </span>
              <span className="text-gray-800 truncate" title={meta.value}>
                {meta.value}
              </span>
            </div>
          ))}
          {metadata.length > 3 && (
            <div className="text-xs text-gray-500">
              +{metadata.length - 3} more
            </div>
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