"use client"

import { Row } from "@tanstack/react-table"
import { EyeIcon, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { typeSchema } from "../../settings/columns"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onView?: (row: TData) => void
  onDelete?: (row: TData) => void
  onEdit?: (row: TData) => void
}

export function DataTableRowActions<TData>({
  row,
  onView,
  onDelete,
  onEdit,  
}: DataTableRowActionsProps<TData>) {
  // const task = typeSchema.parse(row.original)

  return (
    <div className="flex gap-2">
      {onView && (
      <Button variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" onClick={onView}><EyeIcon /></Button>
      )}
      {onEdit && onDelete && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
        {onEdit && (
          <>
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          </>
        )}
          {onDelete && (
          <DropdownMenuItem onClick={onDelete}>
            Delete
            {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )}
    </div>
  )
}

{/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator /> */}
          {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.label}>
                {labels.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub> */}
