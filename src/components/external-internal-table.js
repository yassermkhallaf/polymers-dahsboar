import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const ExternalInternalTable = ({ externalInternalData }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="flex flex-col gap-4 font-montserrat-alternates">
      <div className="flex gap-2 w-full justify-between">
        <div className="flex gap-2 items-center">
          <div className="size-4 bg-[#BE2429] rounded-full shadow-lg" />
          <p className="font-montserrat-alternates font-semibold">External</p>
        </div>
        <p className="font-roboto-mono">
          {(externalInternalData.external / 1000).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          Ton
        </p>
      </div>
      <div className="flex gap-2 w-full justify-between">
        <div className="flex gap-2 items-center">
          <div
            className={cn(
              "size-4 bg-[#E5E7EB] rounded-full shadow-lg",
              isDark ? "bg-[#5F697D]" : "bg-[#E5E7EB]"
            )}
          />{" "}
          <p className="font-montserrat-alternates font-semibold">Internal</p>
        </div>
        <p className="font-roboto-mono">
          <span className="">
            {(externalInternalData.internal / 1000).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>{" "}
          <span className=" drop-shadow-2xl">Ton</span>
        </p>
      </div>
    </div>
  );
};
export default ExternalInternalTable;
