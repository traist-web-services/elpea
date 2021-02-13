import { useState, useReducer, useEffect } from "react";
import { signIn, getSession } from "next-auth/client";

import NowPlayingPanel from "@components/NowPlayingPanel";
import CoverFlow from "@components/CoverFlow";
import ArtistSearch from "./ArtistSearch";
import RecordPlayer from "@components/RecordPlayer";

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
  const [fetchStatus, setFetched] = useState({
    limit: 50,
    offset: 0,
    total: 1,
  });

  const [artists, setArtists] = useState({});
  const [loading, setLoading] = useState(true);
  const [randomArtists, setRandomArtists] = useState([""]);

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

  const playWithSpotify = async (uri: string) => {
    // TODO: Nicen this up with proper loading screen etc.
    // const currentSession = await getSession();

    const response = await fetch("/api/auth/session");
    if (!response.ok) {
      throw new Error();
    }
    const currentSession = await response.json();
    /* , async (url) => {
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    });

    // For loading
    if (!error && !data) {
    }

    // For no session
    if (!data) {
    }

    // For session existing
    if (data) {
    }

    // Make change on user
    async function handleSubmit(e: React.SyntheticEvent) {
      // e.g. update user profile

      // Get the latest session
      mutate("/api/auth/session");
    } */
    const token = currentSession?.user?.accessToken;
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

  const pause = async () => {
    const response = await fetch("/api/auth/session");
    if (!response.ok) {
      throw new Error();
    }
    const currentSession = await response.json();
    const token = currentSession?.user?.accessToken;
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

  // TODO: this is a bit of an ugly type hack
  let myWindow = window as any;
  myWindow.onSpotifyWebPlaybackSDKReady = async () => {
    const currentSession = await getSession();
    const token = currentSession?.user?.accessToken;
    let interval = null;
    let stop = false;
    let paused = false;
    const player = new myWindow.Spotify.Player({
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
      debugger;
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

            setNowPlaying({
              type: "UPDATE_MS_PLAYED",
              data: state.position,
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

  useEffect(() => {
    const fetchTracks = async () => {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error();
      }
      const currentSession = await response.json();
      const token = currentSession?.user?.accessToken;
      fetch(
        `https://api.spotify.com/v1/me/tracks?limit=${fetchStatus.limit}&offset=${fetchStatus.offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.statusText);
          }
        })
        .then((data) => {
          const fetchedArtists = artists;
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
              if (!fetchedArtists[artist.name]) {
                fetchedArtists[artist.name] = [albumObj];
                return;
              }
              if (
                fetchedArtists[artist.name].some(
                  (el) => el.name === track.album.name
                )
              ) {
                return;
              }
              fetchedArtists[artist.name].push(albumObj);
            });
            setArtists(fetchedArtists);
          });
          if (data.offset + data.limit > data.total) {
            const getRandomArtist = () =>
              Object.keys(artists)[
                Math.floor(Math.random() * Object.keys(artists).length)
              ];
            setRandomArtists([getRandomArtist(), getRandomArtist()]);
            setLoading(false);
            return;
          }
          setFetched({
            limit: 50,
            offset: data.offset + data.limit,
            total: data.total,
          });
        })
        .catch((err) => console.error(err));
    };
    fetchTracks();
  }, [artists, fetchStatus]);

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="flex items-stretch flex-grow w-full h-full">
        <div className="w-1/5 h-full">
          <div className="flex flex-col h-full">
            <div className="max-h-full overflow-hidden">
              <ArtistSearch
                artists={artists}
                loading={loading}
                randomArtists={randomArtists}
                playWithSpotify={playWithSpotify}
              />
            </div>
            <div className="flex-shrink-0 px-2 pb-2">
              <RecordPlayer nowPlaying={nowPlaying} pause={pause} />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-4/5 h-full bg-brand-grey-800">
          <CoverFlow
            artists={artists}
            loading={loading}
            fetchStatus={fetchStatus}
            playWithSpotify={playWithSpotify}
          />
          <div className="flex-grow w-full h-full">
            <NowPlayingPanel nowPlaying={nowPlaying} pause={pause} />
          </div>
        </div>
      </div>
    </div>
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
