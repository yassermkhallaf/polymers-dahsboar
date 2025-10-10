"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
import { format } from "date-fns";

function SelectData({ method }) {
  const { handleChangeDateFrom, handleChangeDateTo, from, to } =
    useDashboardDataContext();
  useEffect(() => {}, [to]);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(method === "FROM" ? from : to);
  useEffect(() => {
    if (method === "FROM") {
      setDate(from);
    } else {
      setDate(to);
    }
  }, [from, to, method]);
  return (
    <div className="flex flex-col gap-3 font-montserrat-alternates text-xl">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className=" justify-between  !px-6  flex items-center text-lg font-medium    "
            disabled={method === "TO" && !from ? true : false}
          >
            {method === "FROM" && !from
              ? "Select FROM date"
              : method === "FROM"
              ? format(from, "dd MMM yyyy")
              : !to
              ? "Select TO date"
              : format(to, "dd MMM yyyy")}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            month={date}
            onMonthChange={setDate}
            selected={date}
            captionLayout="dropdown"
            formatters={{
              formatMonthDropdown: (date) =>
                date.toLocaleString("default", { month: "short" }),
            }}
            disabled={method === "TO" && from ? { before: from } : undefined}
            onSelect={(date) => {
              const formattedDate = format(date, "yyyy-MM-dd");

              setDate(formattedDate);
              setOpen(false);
              if (method === "FROM") {
                handleChangeDateFrom(formattedDate);
              }
              if (method === "TO") {
                handleChangeDateTo(formattedDate);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
export default SelectData;
