import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

import { toast } from "sonner";
export const useGetDashboardData = ({ from, to }) => {
  console.log(from, to);
  const query = useQuery({
    queryKey: ["dashboard-data", from, to],
    queryFn: async () => {
      try {
        const response = await client.api.batches["dashboard-data"].$get({
          query: {
            from,
            to,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        console.log(data);
        return data;
      } catch (e) {
        toast.error("Failed to fetch dashboard data");
        // return {};
      }
    },
  });
  return query;
};
