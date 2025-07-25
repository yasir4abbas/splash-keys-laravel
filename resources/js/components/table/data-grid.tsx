"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataGridProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onView?: (row: TData) => void
  onDelete?: (row: TData) => void
  onEdit?: (row: TData) => void
  onActivate?: (row: TData) => void
  onDeactivate?: (row: TData) => void
  renderCard?: (row: TData) => React.ReactNode
  flagColumn?: string
  getFlagUrl?: (row: TData) => string
  onWorkDay?: (row: TData) => void
}

export function DataGrid<TData, TValue>({
  columns,
  data,
  onView,
  onDelete,
  onEdit,
  onActivate,
  onDeactivate,
  renderCard,
  flagColumn,
  getFlagUrl,
  onWorkDay
}: DataGridProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    meta: {
      onView,
      onDelete,
      onEdit,
      onActivate,
      onDeactivate,
      onWorkDay
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const renderDefaultCard = (row: TData) => {
    const cells = table.getRowModel().rows.find(r => r.original === row)?.getVisibleCells() || []
    
    // Find title, description, and status cells
    const titleCell = cells.find(cell => 
      cell.column.id === 'name' || 
      cell.column.id === 'title' || 
      cell.column.id === 'label' ||
      cell.column.id === 'name'
    )
    const descriptionCell = cells.find(cell => 
      cell.column.id === 'description' || 
      cell.column.id === 'email' || 
      cell.column.id === 'country'
    )
    const statusCell = cells.find(cell => 
      cell.column.id === 'status' || 
      cell.column.id === 'active'
    )

    // Get flag URL
    const getFlagSrc = () => {
      if (getFlagUrl) {
        return getFlagUrl(row)
      }
      if (flagColumn) {
        const flagCell = cells.find(cell => cell.column.id === flagColumn)
        if (flagCell) {
          const flagValue = flexRender(flagCell.column.columnDef.cell, flagCell.getContext())
          // If it's a string, assume it's a URL or country code
          if (typeof flagValue === 'string') {
            console.log(flagValue)
            // If it looks like a URL, use it directly
            if (flagValue.startsWith('http') || flagValue.startsWith('/')) {
              return flagValue
            }
            // If it's a country code, construct flag URL (you can customize this)
            return `https://flagcdn.com/24x18/${flagValue.toLowerCase()}.png`
          }
        }
      }
      return null
    }

    const flagSrc = getFlagSrc()

    return (
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {flagSrc && (
                  <img 
                    src={flagSrc} 
                    alt="Flag" 
                    className="w-5 h-4 object-cover rounded-sm border"
                    onError={(e) => {
                      // Hide flag if image fails to load
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                <CardTitle className="text-lg font-semibold truncate">
                  {titleCell ? flexRender(titleCell.column.columnDef.cell, titleCell.getContext()) : 'Untitled'}
                </CardTitle>
              </div>
              {descriptionCell && (
                <CardDescription className="mt-1 line-clamp-2">
                  {flexRender(descriptionCell.column.columnDef.cell, descriptionCell.getContext())}
                </CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (
                  <DropdownMenuItem onClick={() => onView(row)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(row)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onWorkDay && (
                  <DropdownMenuItem onClick={() => onWorkDay(row)}>
                    <Clock className="mr-2 h-4 w-4" />
                    Edit Schedule
                  </DropdownMenuItem>
                )}
                {onActivate && (
                  <DropdownMenuItem onClick={() => onActivate(row)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate
                  </DropdownMenuItem>
                )}
                {onDeactivate && (
                  <DropdownMenuItem onClick={() => onDeactivate(row)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Deactivate
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(row)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {statusCell && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {flexRender(statusCell.column.columnDef.cell, statusCell.getContext())}
              </div>
            )}
            {/* Render other cells as key-value pairs */}
            {cells
              .filter(cell => 
                cell.column.id !== 'name' && 
                cell.column.id !== 'title' && 
                cell.column.id !== 'label' &&
                cell.column.id !== 'description' && 
                cell.column.id !== 'email' && 
                cell.column.id !== 'country' &&
                cell.column.id !== 'status' && 
                cell.column.id !== 'active' &&
                cell.column.id !== flagColumn
              )
              .slice(0, 3) // Limit to 3 additional fields
              .map((cell) => (
                <div key={cell.id} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">
                    {cell.column.id.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-medium">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      
      {table.getRowModel().rows?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {table.getRowModel().rows.map((row) => (
            <div key={row.id}>
              {renderCard ? renderCard(row.original) : renderDefaultCard(row.original)}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">No results found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
      
      <DataTablePagination table={table} />
    </div>
  )
}
