"use server";

import { checkSession } from "@/actions/auth/checkSession";
import Auth from "@/features/auth/pages/auth";
import { redirect } from "next/navigation";
import Layout from "@/components/layout";

export default async function AuthPage() {
  const sessionIsValid = await checkSession();
  if (sessionIsValid) {
    redirect("/");
  }
  return (
    <Layout>
      <Auth />
    </Layout>
  );
}
