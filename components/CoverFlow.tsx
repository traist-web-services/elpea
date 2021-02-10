import { useState, useEffect } from "react";
import { signIn } from "next-auth/client";
import useSWR from "swr";

import LP from "@components/LP";
import ArtistLabel from "@components/ArtistLabel";

interface CoverFlowProps {
  session: any;
  playWithSpotify: (uri: string) => void;
}
export default function CoverFlow({
  session,
  playWithSpotify,
}: CoverFlowProps) {
  const [mounted, setMounted] = useState(false);

  const fetcher = (url) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.user?.accessToken,
      },
    }).then((res) => res.json());
  const endpoint = "https://api.spotify.com/v1/me/tracks";
  const { data, error } = useSWR(mounted ? endpoint : null, fetcher);

  if (error) {
    console.error(error);
    signIn("spotify", { callbackUrl: process.env.REDIRECT_URI });
  }

  const artists = {};
  data?.items?.forEach(({ track }) => {
    if (track.album.total_tracks < 2) {
      return;
    }
    const albumObj = {
      name: track.album.name,
      spotifyId: track.album.id,
      previewImage: track.album.images[0].url,
    };
    track.artists.forEach((artist) => {
      if (!artists[artist.name]) {
        artists[artist.name] = [albumObj];
        return;
      }
      if (artists[artist.name].some((el) => el.name === track.album.name)) {
        return;
      }
      artists[artist.name].push(albumObj);
    });
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const artistList = Object.keys(artists).sort();
  return (
    <>
      <ul className="flex w-full overflow-x-scroll h-56 my-8">
        {artistList.map((artist) => {
          return (
            <li className="flex" key={artist}>
              <ArtistLabel>{artist}</ArtistLabel>
              <ul className="flex">
                {artists[artist].map((album) => {
                  return (
                    <LP
                      previewImage={album.previewImage}
                      spotifyId={album.spotifyId}
                      key={album.spotifyId}
                      playWithSpotify={playWithSpotify}
                    />
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
}
