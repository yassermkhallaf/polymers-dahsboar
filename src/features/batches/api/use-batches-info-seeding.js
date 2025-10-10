import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "sonner";
const useBatchesInfoSeeding = () => {
  const mutation = useMutation({
    mutationFn: async ({ data }) => {
      const response = await client.api.batches["batches-info-seeding"][
        "$post"
      ]({
        json: data,
      });
      if (!response.ok) {
        throw new Error("Failed to seed batches info");
      }
    },
    onSuccess: () => {
      toast.success("Batches info seeded successfully");
    },
    onError: () => {
      toast.error("Failed to seed batches info");
    },
  });
  return mutation;
};
export default useBatchesInfoSeeding;
