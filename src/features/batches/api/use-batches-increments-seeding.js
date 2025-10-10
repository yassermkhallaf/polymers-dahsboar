import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "sonner";
const useBatchesIncrementsSeeding = () => {
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await client.api.batches["batches-increments-seeding"][
        "$post"
      ]({
        json: data,
      });
      if (!response.ok) {
        throw new Error("Failed to seed batches increments");
      }
    },
    onSuccess: () => {
      toast.success("Batches increments seeded successfully");
    },
    onError: () => {
      toast.error("Failed to seed batches increments");
    },
  });
  return mutation;
};
export default useBatchesIncrementsSeeding;
