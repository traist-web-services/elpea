import { signIn } from "next-auth/client";
import SpotifyIcon from "@components/Icons/SpotifyIcon";

export default function Landing() {
  return (
    <>
      <h1 className="text-white text-8xl mb-4">
        Welcome to {process.env.brandName}
      </h1>
      <p className="text-white mb-8 text-2xl">
        To get started, you'll need to log in with Spotify.
      </p>
      <button
        className="relative rounded-full items-center bg-green-500 text-white px-4 py-2 flex"
        onClick={() => signIn()}
      >
        <SpotifyIcon />
        <span className="ml-2 text-xl">Log In With Spotify</span>
      </button>
      <p className="text-white mt-8">
        When you log in with Spotify, you'll grant {process.env.brandName} some
        accesses to read your Spotify profile, and control playback. This is
        needed in order for us to provide the functionality of the site, but we
        don't store this or use it for any other purpose.
      </p>
    </>
  );
}
