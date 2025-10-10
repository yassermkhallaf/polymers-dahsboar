"use client";
import ExternalInternalPieChart from "./charts/external-internal-pie-chart";
import ProductivityLineChart from "./charts/productivity-line-chart";
import MapDisplay from "./map-display";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExternalInternalTable from "./external-internal-table";
import ItemCategoryMapTree from "./charts/item-category-maptree";
import MachinesBarChar from "./charts/machines-bar-chart";
const Dashboard = ({ data }) => {
  console.log(data);
  return (
    <div className="pt-8 ">
      {/* <MapDisplay /> */}
      <div className="grid md:grid-cols-12 md:grid-rows-12 grid-cols-1 grid-rows-1 gap-4  h-[83Vh] ">
        <Card className="md:col-span-3 md:row-span-5 col-span-1 row-span-1 shadow-lg">
          <CardContent className=" flex flex-col h-full justify-between">
            <div className=" flex justify-center items-center h-full">
              <ExternalInternalPieChart
                externalInternalData={data?.customerTypeObj}
              />
            </div>
            <ExternalInternalTable
              externalInternalData={data?.customerTypeObj}
            />
          </CardContent>
        </Card>
        <Card className="md:col-start-4 md:col-end-13 md:row-start-1 md:row-end-6 col-span-1 row-span-1 shadow-lg">
          <CardHeader>
            <CardTitle>Productivity</CardTitle>
          </CardHeader>
          <CardContent className=" h-full">
            <ProductivityLineChart batches={data?.batches} />
          </CardContent>
        </Card>
        <Card className="md:col-span-3 md:row-start-6 md:row-end-12 col-span-1 row-span-1 shadow-lg">
          <CardContent className=" ">
            <ItemCategoryMapTree categoryData={data?.categoryData} />
          </CardContent>
        </Card>
        <Card className="md:col-start-7 md:col-end-13 md:row-start-6 md:row-end-12 col-span-1 row-span-1 shadow-lg">
          <CardContent className="h-full mt-4">
            <MachinesBarChar data={data?.routingData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
