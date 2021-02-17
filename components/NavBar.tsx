import Image from "next/image";
import { signOut } from "next-auth/client";
import { memo } from "react";

function NavBar({ session }) {
  return (
    <nav className="relative flex items-center justify-between w-full px-4 py-2 border-b-2 2xl:py-4 bg-brand-900 border-brand-400">
      <h1 className="text-2xl font-bold 2xl:text-5xl text-brand-grey-50">
        {process.env.brandName}
      </h1>
      <button
        className="relative flex items-center px-4 py-2 transition-colors duration-200 rounded-full shadow cursor-pointer hover:bg-brand-500 bg-brand-700 text-brand-grey-100"
        onClick={() => signOut()}
      >
        <div className="relative w-8 h-8 mr-2 overflow-hidden rounded-full">
          <Image src={session.user.picture} layout="fill" objectFit="cover" />
        </div>
        <span className="text-sm tracking-widest uppercase text-bold">
          Sign out
        </span>
      </button>
    </nav>
  );
}

export default memo(NavBar);
