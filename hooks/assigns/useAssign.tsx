"use client";

import {
  createAssign,
  deleteAssign,
  getAssigns,
  getPassangers,
} from "@/actions/assigns/assignAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateAssign = ({
  location,
}: {
  location?: { latitude: string; longitude: string };
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["createAssign"],
    mutationFn: async ({ ride_id }: { ride_id: string }) => {
      const res = await createAssign({ ride_id });
      queryClient.invalidateQueries({
        queryKey: ["nearbyResult", location ? location : null],
      });
      queryClient.invalidateQueries({ queryKey: ["getAssigns"] });
      return res;
    },
  });
  return mutation;
};

export const useDeleteAssign = ({
  location,
}: {
  location?: { latitude: string; longitude: string };
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["deleteAssign"],
    mutationFn: async ({ ride_id }: { ride_id: string }) => {
      const res = deleteAssign({ ride_id });
      queryClient.invalidateQueries({
        queryKey: ["nearbyResult", location ? location : null],
      });
      queryClient.invalidateQueries({ queryKey: ["getAssigns"] });
      return res;
    },
  });
  return mutation;
};

export const useGetAssigns = () => {
  const query = useQuery({
    queryKey: ["getAssigns"],
    queryFn: async () => {
      const res = await getAssigns();
      return res;
    },
  });
  return query;
};

export const useGetPasssangers = () => {
  const query = useQuery({
    queryKey: ["getPassangers"],
    queryFn: async () => {
      const res = await getPassangers();
      return res;
    },
  });
  return query;
};
