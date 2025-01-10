"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetUser } from "@/hooks/auth/useAuth";
import { useGetRides } from "@/hooks/ride/useRide";

import React from "react";
import { columns, Rides } from "./offerRidecolumns";
import DataTable from "./data-table";
import DataTableAssigns from "./data-tableAssigns";
import { userColumns } from "./userAssignColumns";
import { useGetAssigns } from "@/hooks/assigns/useAssign";

export default function UserCard() {
  const user = useGetUser();
  const { data: userAssigns, isLoading: userDataLoading } = useGetAssigns();
  return (
    <Card className="md:rounded-lg rounded-none border-0 md:border">
      <CardHeader>
        <CardTitle>My Offers</CardTitle>
        <CardDescription>Your offers are listed here</CardDescription>
      </CardHeader>
      <CardContent className="md:p-6 p-0">
        <CardContent>
          {userDataLoading ? (
            <p>Loading...</p>
          ) : userAssigns ? (
            <DataTableAssigns data={userAssigns} columns={userColumns} />
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </CardContent>
    </Card>
  );
}
