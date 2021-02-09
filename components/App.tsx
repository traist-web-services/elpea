import { signIn, signOut } from "next-auth/client";
import Image from "next/image";

import NowPlayingPanel from "@components/NowPlayingPanel";
import CoverFlow from "@components/CoverFlow";
import { useEffect, useState } from "react";

export default function App({ session }) {
  const token = session?.user?.accessToken;
  // TODO: Tidy these bad boys up into a single 'nowPlaying' object
  const [playing, setPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [percentageProgress, setPercentageProgress] = useState(0);
  const [labelImage, setLabelImage] = useState("");
  const [spotifyPlayer, setSpotifyPlayer] = useState(null);
  const [playingAlbum, setPlayingAlbum] = useState({
    artist: "",
    name: "",
    tracks: [],
  });
  const [playingTrack, setPlayingTrack] = useState({
    id: 0,
  });
  const [currentProgress, setCurrentProgress] = useState(0);

  /*

  {
    playing: boolean,
    album: {
      artist: string,
      name: string,

    },

  }

  */
  const playWithSpotify = (uri: string, image: string) => {
    if (!spotifyPlayer) {
      console.error("Player not ready");
      return;
    }
    setPlaying(true);
    setLabelImage(image);
    fetch(`https://api.spotify.com/v1/albums?ids=${uri}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        const album = data.albums[0];
        setPlayingAlbum({
          artist: album.artists.map((artist) => artist.name).join(", "),
          name: album.name,
          tracks: album.tracks.items,
        });

        console.log(playingAlbum);
      });
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      body: JSON.stringify({ context_uri: `spotify:album:${uri}` }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const interval = setInterval(() => {
      spotifyPlayer.getCurrentState().then((state) => {
        if (!state || state.paused) {
          console.log("User is not playing music through the Web Playback SDK");
          stopPlaying(interval);
          return;
        }
        setCurrentProgress(state.position);
      });
    }, 300);
  };
  useEffect(() => {
    const albumLength = playingAlbum.tracks.reduce((acc, curr) => {
      return acc + curr.duration_ms;
    }, 0);
    console.log(albumLength);

    const trackIndex = playingAlbum.tracks.findIndex((track) => {
      return track.id === playingTrack.id;
    });
    const playedTracks = playingAlbum.tracks.slice(0, trackIndex);
    let position = playedTracks.length
      ? playedTracks.reduce((acc, curr) => acc + curr.duration_ms, 0)
      : 0;
    position += currentProgress;
    const progress = position / albumLength;
    console.log(position, albumLength, progress, currentProgress);
    setPercentageProgress(progress);
  }, [playing, playingAlbum, playingTrack, currentProgress]);

  const pause = () => {
    let url = "https://api.spotify.com/v1/me/player/pause";
    if (!playing) {
      url = "https://api.spotify.com/v1/me/player/play";
      setPlaying(true);
    } else {
      setPlaying(false);
    }
    fetch(url, {
      method: "PUT",
      body: JSON.stringify({
        device_id: deviceId,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  function stopPlaying(interval) {
    clearInterval(interval);
    setPlaying(false);
    setPercentageProgress(0);
  }

  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new window.Spotify.Player({
      name: "your record player",
      getOAuthToken: (cb) => {
        cb(token);
      },
    });

    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
      signIn("spotify", { callbackUrl: process.env.REDIRECT_URI });
    });
    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("playback_error", ({ message }) => {
      console.error(message);
    });

    // Playback status updates
    player.addListener("player_state_changed", (state) => {
      const currentTrack = state?.track_window?.current_track;
      setPlayingTrack(currentTrack);
    });

    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      // Turn off shuffle.
      fetch(`https://api.spotify.com/v1/me/player/shuffle`, {
        method: "PUT",
        body: JSON.stringify({ device_id, state: false }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDeviceId(device_id);
    });

    player.connect();

    setSpotifyPlayer(player);
  };

  loadSpotifyPlayer();

  return (
    <>
      <nav className="w-full flex justify-between relative items-center">
        <h1 className="text-white text-6xl">
          Hi {session?.user?.name?.split(" ")[0]}!
        </h1>
        <button
          className="relative rounded-full items-center bg-green-500 text-white px-4 py-2 flex"
          onClick={() => signOut()}
        >
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <Image src={session.user.picture} layout="fill" objectFit="cover" />
          </div>
          <span className="ml-2 text-white text-xl">Sign out</span>
        </button>
      </nav>

      <CoverFlow session={session} playWithSpotify={playWithSpotify} />
      <NowPlayingPanel
        playing={playing}
        labelImage={labelImage}
        percentageProgress={percentageProgress}
        playingAlbum={playingAlbum}
        playingTrack={playingTrack}
        pause={pause}
      />
    </>
  );
}

function loadSpotifyPlayer(): Promise<any> {
  return new Promise<void>((resolve, reject) => {
    const scriptTag = document.getElementById("spotify-player");

    if (!scriptTag) {
      const script = document.createElement("script");

      script.id = "spotify-player";
      script.type = "text/javascript";
      script.async = false;
      script.defer = true;
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.onload = () => resolve();
      script.onerror = (error: any) =>
        reject(new Error(`loadScript: ${error.message}`));

      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}
