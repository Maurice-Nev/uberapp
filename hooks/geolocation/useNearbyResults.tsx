// "use client";

import { GetNearbyResults } from "@/actions/geolocation/nearbyResults";
import { useQuery } from "@tanstack/react-query";

export const useGetNearbyResults = ({
  location,
  radius,
  destination,
}: {
  location: { latitude: string; longitude: string };
  radius: string;
  destination: any;
}) => {
  const query = useQuery({
    queryKey: ["nearbyResult", location],
    queryFn: async () => {
      const res = await GetNearbyResults({
        location: location,
        radius: radius,
        destination,
      });
      return res;
    },
  });
  return query;
};
