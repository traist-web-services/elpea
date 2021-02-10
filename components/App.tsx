import { signIn, signOut } from "next-auth/client";
import Image from "next/image";

import NowPlayingPanel from "@components/NowPlayingPanel";
import CoverFlow from "@components/CoverFlow";
import { useState, useReducer } from "react";

interface Album {
  artist: string;
  name: string;
  duration: number;
  image: string;
  tracks: Track[];
}

interface Track {
  name: string;
  id: string;
  duration_ms: number;
}

interface NowPlayingState {
  playing: boolean;
  paused: boolean;
  msPlayed: number;
  album: Album;
  track: Track;
}

interface Action {
  type: string;
  data?: any;
}

export default function App({ session }) {
  const token = session?.user?.accessToken;
  // TODO: Tidy these bad boys up into a single 'nowPlaying' object
  //const [playing, setPlaying] = useState(false);
  const initialNowPlaying: NowPlayingState = {
    playing: false,
    msPlayed: 0,
    paused: false,

    album: {
      artist: "",
      name: "",
      tracks: [],
      duration: 0,
      image: "",
    },
    track: {
      name: "",
      id: "",
      duration_ms: 0,
    },
  };
  const [nowPlaying, setNowPlaying] = useReducer(reducer, initialNowPlaying);
  const [deviceId, setDeviceId] = useState("");
  const [spotifyPlayer, setSpotifyPlayer] = useState(null);

  function reducer(state: NowPlayingState, action: Action) {
    switch (action.type) {
      case "SET_PLAYING_ALBUM":
        return {
          ...state,
          playing: true,
          album: action.data,
        };
      case "SET_PLAYING_TRACK":
        return {
          ...state,
          track: action.data,
        };
      case "UPDATE_MS_PLAYED":
        return {
          ...state,
          msPlayed: action.data,
          playing: action.data !== state.msPlayed,
          paused: action.data === state.msPlayed,
        };
      case "PLAYBACK_PAUSED":
        return {
          ...state,
          paused: true,
          playing: false,
        };
      case "PLAYBACK_RESUMED":
        return {
          ...state,
          playing: true,
          paused: false,
        };
      case "PLAYBACK_STOPPED":
        return initialNowPlaying;
      default:
        console.error("You dispatched an invalid action type");
    }
  }

  const playWithSpotify = (uri: string) => {
    // TODO: Nicen this up with proper loading screen etc.
    if (!spotifyPlayer) {
      console.error("Player not ready");
      return;
    }
    const audio = new Audio("/vinylstart.ogg");
    audio.play();

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
        // TODO: Fix artist type
        setNowPlaying({
          type: "SET_PLAYING_ALBUM",
          data: {
            artist: album.artists.map((artist: any) => artist.name).join(", "),
            name: album.name,
            tracks: album.tracks.items,
            image: album.images[0].url,
            duration: album.tracks.items.reduce(
              (acc: number, curr: Track) => acc + curr.duration_ms,
              0
            ),
          },
        });
      });

    // This is a bit odd here... it seems that unless the device is actually playing, then this call will fail. I don't know if this is fixable, but if users choose to enable shuffle manually and defeat the point of this, well then I don't know what we're doing...
    fetch(
      `https://api.spotify.com/v1/me/player/shuffle?device_id=${deviceId}&state=false`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      body: JSON.stringify({ context_uri: `spotify:album:${uri}` }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const pause = () => {
    let url = "https://api.spotify.com/v1/me/player/pause";
    if (!nowPlaying.playing) {
      url = "https://api.spotify.com/v1/me/player/play";
      setNowPlaying({
        type: "PLAYBACK_RESUMED",
      });
    } else {
      setNowPlaying({
        type: "PLAYBACK_PAUSED",
      });
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

  window.onSpotifyWebPlaybackSDKReady = () => {
    let interval = null;
    let stop = false;
    let paused = false;
    const player = new window.Spotify.Player({
      name: process.env.brandName,
      getOAuthToken: (cb: (token: string) => void) => {
        cb(token);
      },
    });

    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
      signIn("spotify", {
        callbackUrl: process.env.REDIRECT_URI,
        redirect: false,
      });
    });
    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("playback_error", ({ message }) => {
      console.error(message);
    });

    // TODO: Fix state:any type below
    player.addListener("player_state_changed", (state: any) => {
      if (!state) {
        if (!stop) {
          stop = true;
          return;
        }

        setNowPlaying({
          type: "PLAYBACK_STOPPED",
        });

        if (interval) {
          interval = clearInterval(interval);
        }
        return;
      }
      stop = false;
      const currentTrack = state?.track_window?.current_track;

      if (currentTrack) {
        setNowPlaying({
          type: "SET_PLAYING_TRACK",
          data: currentTrack,
        });
      }

      if (!state.paused && interval) {
        return;
      }

      if (state.paused) {
        setNowPlaying({
          type: "PLAYBACK_PAUSED",
        });
        if (interval) {
          interval = clearInterval(interval);
        }
        paused = true;
        return;
      } else if (!state.paused && !interval) {
        interval = setInterval(() => {
          // TODO: Fix state:any type below
          player.getCurrentState().then((state: any) => {
            if (paused === true) {
              paused = false;
              setNowPlaying({
                type: "PLAYBACK_RESUMED",
              });
            }
            const trackIndex = nowPlaying.album.tracks.findIndex(
              (track: Track) => {
                return track.id === nowPlaying.track.id;
              }
            );
            const playedTracks = nowPlaying.album.tracks.slice(0, trackIndex);
            const totalPlayed =
              state.position +
              playedTracks.reduce(
                (acc: number, curr: Track) => acc + curr.duration_ms,
                0
              );

            setNowPlaying({
              type: "UPDATE_MS_PLAYED",
              data: totalPlayed,
            });
          });
        }, 1000);
      }
    });

    player.addListener("ready", ({ device_id }) => {
      // console.log("Ready with Device ID", device_id);
      setSpotifyPlayer(player);
      setDeviceId(device_id);
    });

    player.connect();
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
      <NowPlayingPanel nowPlaying={nowPlaying} pause={pause} />
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
