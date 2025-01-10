"use server";

import Layout from "@/components/layout";
import GeolocationComponent from "@/features/booking/components/geolocation";

export default async function Booking() {
  return (
    <Layout>
      <div className="px-8 md:px-0">
        <div className="text-3xl font-medium my-4">Booking page</div>
        <GeolocationComponent />
      </div>
    </Layout>
  );
}
