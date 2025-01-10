import Layout from "@/components/layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="w-full flex justify-center pt-16">
        <div>
          <div className="flex items-center gap-6">
            <h1 className="text-4xl">404</h1>
            <h2>Not Found</h2>
          </div>
        </div>
      </div>
    </Layout>
  );
}
