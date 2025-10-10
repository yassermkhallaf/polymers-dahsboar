import UploadBatchIncrements from "@/features/batches/components/upload-bach-increments";
import UploadBatchInfo from "@/features/batches/components/upload-batch-info";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <UploadBatchInfo />
      <UploadBatchIncrements />
    </div>
  );
}
