"use server";

import { checkSession } from "@/actions/auth/checkSession";
import Layout from "@/components/layout";
import { MyRidesPage } from "@/features/my-rides/pages/myRidesPage";
import { redirect } from "next/navigation";

export default async function myRidesPage() {
  const sessionIsValid = await checkSession();
  if (!sessionIsValid) {
    redirect("/auth");
  }
  return (
    <Layout>
      <MyRidesPage />
    </Layout>
  );
}
