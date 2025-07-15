"use client"
 
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
 
interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}
 
export function DatePicker({ value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto p-0">
        <Calendar 
          mode="single" 
          selected={value} 
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }} 
        />
      </DialogContent>
    </Dialog>
  )
}