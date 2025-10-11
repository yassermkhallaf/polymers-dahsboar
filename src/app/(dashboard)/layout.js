import NavBar from "@/components/nav-bar";
import { DashboardDataProvider } from "@/features/batches/context/use-dashboard-data-context";

import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

const DashboardLayout = async ({ children, searchParams }) => {
  return (
    <DashboardDataProvider>
      <div className="max-w-[90%] mx-auto h-screen">
        <NavBar />
        {children}
      </div>
    </DashboardDataProvider>
  );
};

export default DashboardLayout;
