import Head from "next/head";
import { useSession } from "next-auth/client";

import Landing from "@components/Landing";
import App from "@components/App";

export default function Home() {
  const [session, loading] = useSession();

  return (
    <>
      <Head>
        <title>{process.env.brandName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <main className="bg-gray-700 flex-grow">
          <div className="max-w-5xl mx-auto mt-8">
            {!session && <Landing />}
            {session && <App session={session} />}
          </div>
        </main>
        <footer></footer>
      </div>
    </>
  );
}
