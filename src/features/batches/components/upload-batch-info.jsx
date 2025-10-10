"use client";
import { useState, useRef } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useBatchesInfoSeeding from "../api/use-batches-info-seeding";
const UploadBatchInfo = () => {
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    e.target.value = "";
  };
  const { mutate, isPending } = useBatchesInfoSeeding();
  const handleUpload = async () => {
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const transformedData = jsonData.map((item) => {
      return {
        batch_no: item["Batch No"],
        global_id: item["Batch No"] + "-" + item["Subinventory"].split("-")[1],
        routing_no: item["Routing No."],
        item_code: item["Item Code"],
        description: item["Description"],
        item_category: item["Item category"],
        cust_name: item["Cust.Name"],
        cust_type: item["Cust.Type"],
        cust_country: item["Cust.Country"],
        sales_rep: item["Salesrep."],
      };
    });

    mutate(
      { data: transformedData },
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
        onChange={handleFileChange}
      />
      <div
        className={cn(
          "size-20 bg-slate-500/10 flex items-center justify-center cursor-pointer rounded-full",
          file && "bg-green-500/10"
        )}
        onClick={() => inputRef.current.click()}
      >
        <button variant="outline" className="rounded-full opacity-100">
          <FileSpreadsheet className="size-10 cursor-pointer" />
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
            <Button
              onClick={() => setFile(null)}
              variant="outline"
              className="text-sm text-muted-foreground hover:text-primary"
              disabled={isPending}
            >
              Remove
            </Button>
            <Button
              onClick={handleUpload}
              className="text-sm text-muted-foreground hover:text-primary"
              disabled={isPending}
            >
              <Upload className="text-white hover:text-primary" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBatchInfo;
