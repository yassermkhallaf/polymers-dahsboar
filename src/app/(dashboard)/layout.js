import NavBar from "@/components/nav-bar";
import { DashboardDataProvider } from "@/features/batches/context/use-dashboard-data-context";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

const DashboardLayout = async ({ children }) => {
  return (
    <div className="max-w-[90%] mx-auto h-screen">
      <DashboardDataProvider>
        <NavBar />
        {children}
      </DashboardDataProvider>
    </div>
  );
};

export default DashboardLayout;
