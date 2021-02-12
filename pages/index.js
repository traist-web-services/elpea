import Head from "next/head";
import { useSession } from "next-auth/client";

import NavBar from "@components/NavBar";
import Landing from "@components/Landing";
import App from "@components/App";

export default function Home() {
  const [session, loading] = useSession();

  return (
    <>
      <Head>
        <title>{process.env.brandName}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="flex flex-col h-screen bg-brand-grey-900 text-brand-grey-100">
        {session && <NavBar session={session} />}
        <main className="flex-grow h-full overflow-hidden">
          <div className="h-full">
            {!session && <Landing />}
            {session && <App session={session} />}
          </div>
        </main>
        <footer className="flex flex-col items-end justify-center flex-shrink-0 h-12 px-4 border-t-4 bg-brand-700 border-brand-400">
          <a href="https://traist.co.uk" target="_blank">
            &copy; Traist Web Services 2021
          </a>
        </footer>
      </div>
    </>
  );
}
