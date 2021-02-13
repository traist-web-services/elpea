import { signIn } from "next-auth/client";
import SpotifyIcon from "@components/Icons/SpotifyIcon";

export default function Landing() {
  return (
    <div className="mx-auto max-w-prose">
      <h1 className="mt-8 mb-8 text-6xl text-brand-grey-50">
        Welcome to {process.env.brandName}.
      </h1>
      <p className="mb-2 text-2xl font-bold text-brand-grey-50">
        Hear your favourite artists, warts and all.
      </p>
      <p className="mb-2">
        B-sides, experimental tracks, concept albums all went out the window
        with pay-per-play streaming of tracks - but most of us learned to love
        music by listening to albums from start to finish.
      </p>
      <p className="mb-4">
        {process.env.brandName} is trying to bring it back.
      </p>
      <button
        className="relative flex items-center px-4 py-2 text-white bg-green-600 rounded-full"
        onClick={() =>
          signIn("spotify", {
            callbackUrl: process.env.REDIRECT_URI,
          })
        }
      >
        <SpotifyIcon />
        <span className="ml-2 text-xl">Log in with Spotify to get started</span>
      </button>
      <div className="grid grid-cols-2 mt-4">
        <p className="text-sm text-brand-grey-400">
          When you log in with Spotify, you'll grant {process.env.brandName}{" "}
          some accesses to read your Spotify profile, and control playback. This
          is needed in order for us to provide the functionality of the site,
          but we don't store this or use it for any other purpose.
        </p>
        <p className="text-sm text-brand-grey-400">
          You'll need at least a modern web browser which supports digital
          rights management and a Spotify Premium account. In case of any
          issues, drop a note to{" "}
          <a
            href={`mailto:${process.env.brandName.toLowerCase()}@traist.co.uk`}
            className="underline text-brand-400"
          >
            {process.env.brandName.toLowerCase()}@traist.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}
