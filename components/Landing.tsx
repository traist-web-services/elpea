import { signIn } from "next-auth/client";
import SpotifyIcon from "@components/Icons/SpotifyIcon";

export default function Landing() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mt-8 mb-4 text-white text-8xl">
        Welcome to {process.env.brandName}
      </h1>
      <p className="mb-8 text-2xl text-white">
        To get started, you'll need to log in with Spotify.
      </p>
      <button
        className="relative flex items-center px-4 py-2 text-white bg-green-500 rounded-full"
        onClick={() =>
          signIn("spotify", {
            callbackUrl: process.env.REDIRECT_URI,
          })
        }
      >
        <SpotifyIcon />
        <span className="ml-2 text-xl">Log In With Spotify</span>
      </button>
      <p className="mt-8 text-white">
        When you log in with Spotify, you'll grant {process.env.brandName} some
        accesses to read your Spotify profile, and control playback. This is
        needed in order for us to provide the functionality of the site, but we
        don't store this or use it for any other purpose.
      </p>
    </div>
  );
}
