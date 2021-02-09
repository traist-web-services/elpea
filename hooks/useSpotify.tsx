// https://api.spotify.com/v1/me/tracks
import useSWR from "swr";
import { signIn } from "next-auth/client";

interface useSpotifyArguments {
  accessToken: string;
  stateUpdater: () => void;
}

export default async function useSpotify({ accessToken, stateUpdater }) {
  if (!accessToken) {
    console.log("No access token");
    return [];
  }
  const fetcher = (url) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }).then((res) => res.json());
  const getStarredTracks = async () => {
    const { data, error } = useSWR(
      "https://api.spotify.com/v1/me/tracks",
      fetcher
    );
    if (error) {
      console.log(error);
      signIn("spotify", { callbackUrl: process.env.REDIRECT_URI });
    }
    return await data;
  };

  const { items } = await getStarredTracks();
  // const ;

  const artists = {};
  items.forEach(({ track }) => {
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

  const viewObject = Object.keys(artists)
    .sort()
    .map((artist) => {
      return {
        artist: artist,
        albums: artists[artist].sort(),
      };
    });
  stateUpdater(artists);
  return;
}
