"use client";
import { useState, useRef } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import { excelSerialToDate } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useBatchesIncrementsSeeding from "../api/use-batches-increments-seeding";
const UploadBatchIncrements = () => {
  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetName, setSheetName] = useState(null);
  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);

    if (e.target.files[0]) {
      const data = await e.target.files[0].arrayBuffer();
      const workbook = XLSX.read(data);
      setWorkbook(workbook);
    }
    e.target.value = "";
  };
  const { mutate, isPending } = useBatchesIncrementsSeeding();
  const handleUpload = async () => {
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return;
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const transformedData = [];
    jsonData.forEach((item, i) => {
      if (item["Batch"] && Number(item["Qty."])) {
        transformedData.push({
          global_id: item["Batch"] + "-" + sheetName.split("-")[0],

          batch_no: item["Batch"],
          increment_id: sheetName + "-" + file.name.split(" ")[0],
          qty: Number(item["Qty."]),
          created_at: excelSerialToDate(item["Date"]),
        });
      }
    });

    mutate(
      {
        increment_id: sheetName + "-" + file.name.split(" ")[0],
        data: transformedData,
      },
      { onSuccess: () => setFile(null), onError: () => setFile(null) }
    );
  };
  const inputRef = useRef(null);
  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={inputRef}
        className="hidden"
        disabled={isPending || file}
        onChange={handleFileChange}
      />
      <div
        className={cn(
          "size-20 bg-slate-500/10 flex items-center justify-center cursor-pointer rounded-full",
          file && "bg-[rgb(52,168,83)]",
          file && "cursor-not-allowed"
        )}
        onClick={() => inputRef.current.click()}
      >
        <button
          variant="outline"
          className={cn(
            "rounded-full opacity-100",
            file && "cursor-not-allowed"
          )}
        >
          <FileSpreadsheet
            className={cn("size-10 text-black", file && "text-white")}
          />
        </button>
      </div>
      {file && (
        <div className=" flex flex-col items-center gap-1">
          <Tooltip>
            <TooltipTrigger>
              <p className="text-sm italic text-muted-foreground max-w-[100px] overflow-hidden truncate">
                {file.name}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{file.name}</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-2">
            <Select value={sheetName} onValueChange={setSheetName}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sheet Name" />
              </SelectTrigger>
              <SelectContent>
                {workbook?.SheetNames.map((sheetName) => (
                  <SelectItem key={sheetName} value={sheetName}>
                    {sheetName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setFile(null);
                setSheetName(null);
              }}
              variant="outline"
              className="text-sm text-muted-foreground hover:text-primary"
              disabled={isPending}
            >
              Remove
            </Button>
            {sheetName && (
              <Button
                onClick={handleUpload}
                className="text-sm text-muted-foreground hover:text-primary"
                disabled={isPending}
              >
                <Upload className="text-white hover:text-primary" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBatchIncrements;
