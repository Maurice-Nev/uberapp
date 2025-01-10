"use client";
import { useGetPasssangers } from "@/hooks/assigns/useAssign";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

// SOOOOOOOOOOOOOOOOOOORY i had no more time... i hate this to

export const PassangerList = () => {
  const { data: passangers, isLoading } = useGetPasssangers();
  const convertTimestamp = (timestamp: any) => {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0]; // Gibt das Datum im Format 'yyyy-mm-dd' zurück
  };
  return (
    <div>
      {isLoading ? (
        "is Loading"
      ) : (
        <div>
          {/* <pre>{JSON.stringify(passangers, null, 2)}</pre> */}
          <div
            key={JSON.stringify(new Date())}
            className="w-full border rounded-lg p-4"
          >
            {passangers?.passangers.map(
              (
                passanger: {
                  rides: {
                    destination:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    departure_date: any;
                    departure_time:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                  };
                  id:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<React.AwaitedReactNode>
                    | null
                    | undefined;
                },
                index: React.Key | null | undefined
              ) => {
                return (
                  <div
                    key={index}
                    className={cn(index != 0 ? "border-t" : null, "py-4")}
                  >
                    <p> {passanger.rides.destination}</p>
                    <p>
                      {convertTimestamp(passanger?.rides.departure_date)}{" "}
                      {passanger.rides.departure_time}
                    </p>
                    <p>{passanger?.id}</p>
                  </div>
                );
              }
            )}
            {/* <RideList groupedRides={passangers?.passangers} /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PassangerList;
