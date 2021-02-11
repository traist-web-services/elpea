import Image from "next/image";
import { signOut } from "next-auth/client";

export default function NavBar({ session }) {
  return (
    <nav className="relative flex items-center justify-between w-full px-4 pt-2">
      <h1 className="text-6xl">Hi {session?.user?.name?.split(" ")[0]}!</h1>
      <button
        className="relative flex items-center px-4 py-2 transition-colors duration-200 rounded-full shadow cursor-pointer hover:bg-brand-500 bg-brand-700"
        onClick={() => signOut()}
      >
        <div className="relative w-10 h-10 overflow-hidden rounded-full">
          <Image src={session.user.picture} layout="fill" objectFit="cover" />
        </div>
        <span className="ml-2 text-xl">Sign out</span>
      </button>
    </nav>
  );
}
