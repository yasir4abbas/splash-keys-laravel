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
  const isFiltered = table.getState().columnFilters.length > 0
  const searchCols = searchColumns && searchColumns.length ? searchColumns : ["name", "label", "country"]
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* {table.getColumn("name") && ( */}
        <Input
          placeholder="Search..."
          value={table.getState().columnFilters.find(filter => 
            searchCols.includes(filter.id)
          )?.value as string ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            const columns = searchCols;
            columns.forEach(columnId => {
              const column = table.getAllColumns().find(col => col.id === columnId);
              column?.setFilterValue(value);
            });
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* )} */}
        
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
            onClick={() => table.resetColumnFilters()}
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
