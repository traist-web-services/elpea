import { signIn } from "next-auth/client";
import SpotifyIcon from "@components/Icons/SpotifyIcon";

export default function NoPremium() {
  return (
    <div className="mx-auto max-w-prose">
      <h1 className="mt-8 mb-8 text-6xl text-brand-grey-50">Bad luck...</h1>
      <p className="mb-2">
        You're not going to be able to use {process.env.brandName}, because we
        can only control playback for you if you have a Spotify Premium account.
      </p>
      <p className="mb-4">This isn't our choice, it's theirs. Sorry.</p>
      <button
        className="relative flex items-center px-4 py-2 text-white bg-green-600 rounded-full"
        onClick={() =>
          (window.location.href = "https://www.spotify.com/premium/")
        }
      >
        <SpotifyIcon />
        <span className="ml-2 text-xl">Sign up for Premium</span>
      </button>
    </div>
  );
}
