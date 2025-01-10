"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RidesCard from "../components/ridesCard";
import UserCard from "../components/userCard";

export const MyRidesPage = () => {
  return (
    <Tabs defaultValue="offers" className="w-full mt-4">
      <TabsList className="w-full md:rounded-lg rounded-none md:w-fit">
        <TabsTrigger value="offers">My Offers</TabsTrigger>
        <TabsTrigger value="my-rides">My Rides</TabsTrigger>
      </TabsList>
      <TabsContent value="offers">
        <RidesCard />
      </TabsContent>
      <TabsContent value="my-rides">
        <UserCard />
      </TabsContent>
    </Tabs>
  );
};
