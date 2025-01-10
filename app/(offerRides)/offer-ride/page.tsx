"use server";

import { checkSession } from "@/actions/auth/checkSession";
import Layout from "@/components/layout";
import OfferRidesPage from "@/features/offer-ride/pages/offerRidesPage";
import { redirect } from "next/navigation";

export default async function RidePage() {
  const sessionIsValid = await checkSession();
  if (!sessionIsValid) {
    redirect("/auth");
  }
  return (
    <Layout>
      <OfferRidesPage />
    </Layout>
  );
}
