import {
  createRideAction,
  getRideAction,
  saveRidedAction,
  updateRidedAction,
} from "@/actions/ride/rideAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateRide = () => {
  const mutation = useMutation({
    mutationKey: ["createRide"],
    mutationFn: async (data: any) => {
      const res = await createRideAction(data);
      return res;
    },
  });
  return mutation;
};

export const useSaveRide = () => {
  const mutation = useMutation({
    mutationKey: ["saveRide"],
    mutationFn: async (data: any) => {
      const res = await saveRidedAction(data);
      return res;
    },
  });
  return mutation;
};

export const useUpdateRide = () => {
  const query = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["updateRide"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await updateRidedAction({ id, data });
      query.invalidateQueries();
      return res;
    },
  });
  return mutation;
};
export const useGetRides = ({ user_id }: { user_id: string }) => {
  const query = useQuery({
    queryKey: ["getRides", user_id],
    queryFn: async () => {
      const res = await getRideAction({ user_id });
      return res;
    },
  });
  return query;
};
