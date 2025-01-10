"use server";

import { CreateOrUpdateRideForm } from "../components/createOrUpdateRideForm";
import IconGrid from "../components/iconGrid";

export default async function OfferRidesPage() {
  return (
    <div>
      <div className="md:flex md:justify-between pb-16 px-8 md:px-0 md:pb-0">
        <div className="w-1/2 aspect-square hidden md:block">
          <IconGrid></IconGrid>
        </div>
        <div className="md:w-1/2 md:flex md:items-center w-full pt-16 md:pt-0">
          <CreateOrUpdateRideForm />
        </div>
      </div>
    </div>
  );
}
