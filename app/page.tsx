import { checkSession } from "@/actions/auth/checkSession";
import Homepage from "@/features/homepage/components/homepage";
import Layout from "@/components/layout";
import { PassangerList } from "@/features/homepage/components/passangerList";

export default async function Home() {
  const sessionIsValid = await checkSession();
  if (!sessionIsValid) {
    return (
      <Layout>
        <Homepage />
      </Layout>
    );
  } else {
    return (
      <Layout>
        <h1 className="text-3xl font-medium my-4">
          Passanger list for your offers
        </h1>
        <PassangerList />
      </Layout>
    );
  }
}
