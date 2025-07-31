"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

// import { priorities, statuses } from "./columns"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumns?: string[]
}

export function DataTableToolbar<TData>({
  table,
  searchColumns,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter !== ""
  
  // Get all searchable columns (excluding action columns)
  const getAllSearchableColumns = () => {
    const allColumns = table.getAllColumns();
    return allColumns.filter(column => 
      column.id !== 'actions' && 
      column.id !== 'select' && 
      column.getCanFilter()
    );
  };

  const searchableColumns = getAllSearchableColumns();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search all columns..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            table.setGlobalFilter(value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        
        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
