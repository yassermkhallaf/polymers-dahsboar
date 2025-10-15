"use client";
import ExternalInternalPieChart from "@/components/charts/external-internal-pie-chart";
import ProductivityLineChart from "@/components/charts/productivity-line-chart";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExternalInternalTable from "@/components/external-internal-table";
import ItemCategoryMapTree from "@/components/charts/item-category-maptree";
import MachinesBarChar from "@/components/charts/machines-bar-chart";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import CategoryBarChart from "@/components/charts/category-bar-chart";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
const ProductionDashboard = () => {
  const mapTreeCardRef = useRef(null);
  const { dashboardData: data } = useDashboardDataContext();

  const lightColors = data?.categoryData.filter((item) =>
    ["White", "Natural"].includes(item.category)
  );
  const darkColors = data?.categoryData.filter(
    (item) => !["White", "Natural"].includes(item.category)
  );

  const [mapTreeCardHeight, setMapTreeCardHeight] = useState(0);
  const [mapTreeCardWidth, setMapTreeCardWidth] = useState(0);
  useEffect(() => {
    setMapTreeCardHeight(mapTreeCardRef.current.clientHeight);
    setMapTreeCardWidth(mapTreeCardRef.current.clientWidth);
  }, []);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="grid md:grid-cols-12 md:grid-rows-12 grid-cols-1 grid-rows-1 gap-2  h-[83Vh] ">
      <div className="md:col-span-3 md:row-span-3 col-span-1 row-span-1 h-full   flex items-center justify-center">
        <div className="flex  items-center text-[rgb(190,36,41)] flex-col">
          <span
            className={cn(
              "text-[4vw] font-bold font-roboto-mono ",
              isDark ? "text-shadow-lg-dark" : "text-shadow-lg-light "
            )}
          >
            {(data?.totalQty / 1000).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span
            className={cn(
              "text-[2vw] self-end font-semibold font-montserrat-alternates uppercase -mt-2",
              isDark ? "text-white" : "text-black"
            )}
          >
            Ton
          </span>
        </div>
      </div>
      <Card className="md:col-span-3 md:row-span-5 col-span-1 row-span-1 shadow-lg p-1 h-full ">
        <CardContent className=" flex flex-col h-full  justify-between">
          <div className=" flex justify-center items-center h-[60%] mt-5">
            <ExternalInternalPieChart
              externalInternalData={data?.customerTypeObj}
            />
          </div>
          <div className="mb-5">
            <ExternalInternalTable
              externalInternalData={data?.customerTypeObj}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-start-7 md:col-end-13 md:row-start-1 md:row-end-6 col-span-1 row-span-1 shadow-lg p-1">
        <CardContent className=" h-full">
          <ProductivityLineChart batches={data?.batches} />
        </CardContent>
      </Card>
      <Card
        ref={mapTreeCardRef}
        className="md:col-span-3 md:row-start-4 md:row-end-12 col-span-1 row-span-1 shadow-lg p-1"
      >
        <CardContent className=" my-auto ">
          <ItemCategoryMapTree
            categoryData={darkColors}
            height={mapTreeCardHeight}
            width={mapTreeCardWidth}
          />
        </CardContent>
      </Card>
      <div className="md:col-span-3 md:row-start-6 md:row-end-12 col-span-1 row-span-1 h-full flex items-center justify-center p-1 ">
        <CategoryBarChart
          data={[
            ...lightColors.map((item) => ({
              categoryName: item.category,
              value: item.value,
            })),
            {
              categoryName: "Colors",
              value:
                data?.totalQty - lightColors.reduce((s, c) => s + c.value, 0),
            },
          ].sort((a, b) => b.value - a.value)}
        />
      </div>
      <Card className="md:col-start-7 md:col-end-13 md:row-start-6 md:row-end-12 col-span-1 row-span-1 shadow-lg p-1">
        <CardContent className="h-full mt-4">
          <MachinesBarChar data={data?.routingData} />
        </CardContent>
      </Card>
    </div>
  );
};
export default ProductionDashboard;
