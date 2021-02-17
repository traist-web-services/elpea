import { useState, useReducer, useEffect, useContext } from "react";
import { signIn, getSession } from "next-auth/client";

import NowPlayingPanel from "@components/NowPlayingPanel";
import CoverFlow from "@components/CoverFlow";
import ArtistSearch from "./ArtistSearch";
import RecordPlayer from "@components/RecordPlayer";
import EqualizerIcon from "./Icons/EqualizerIcon";
import ErrorBar from "./ErrorBar";
import { DispatchContext, StateContext } from "@contexts/AppContext";

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
  const [loading, setLoading] = useState(true);
  const [randomArtists, setRandomArtists] = useState([""]);

  const {
    nowPlaying,
    spotifyPlayer,
    fetchStatus,
    artistsAndAlbums,
    errors: { error, errorMessage, initError },
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const playWithSpotify = async (uri: string) => {
    if (!spotifyPlayer) {
      console.error("Player not ready");
      setTimeout(() => playWithSpotify(uri), 5000);
      return;
    }
    spotifyPlayer?._options?.getOAuthToken((token: string) => {
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
          dispatch({
            type: "SET_PLAYING_ALBUM",
            payload: {
              artist: album.artists
                .map((artist: any) => artist.name)
                .join(", "),
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
        `https://api.spotify.com/v1/me/player/shuffle?device_id=${spotifyPlayer._options.id}&state=false`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${spotifyPlayer._options.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ context_uri: `spotify:album:${uri}` }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((response) => {
        if (!response.ok) {
          console.log(response);
          errorHandler("Could not start playback!");
        }
      });
    });
  };
  const errorHandler = (errorMessage: string) => {
    dispatch({
      type: "SET_ERROR",
      payload: {
        error: true,
        message: errorMessage,
      },
    });
    setTimeout(() => dispatch({ type: "CLEAR_ERROR" }), 5000);
  };

  const pause = async () => {
    if (!spotifyPlayer) {
      console.error("Player not ready");
      setTimeout(() => pause(), 5000);
      return;
    }
    spotifyPlayer?._options?.getOAuthToken((token: string) => {
      let url = "https://api.spotify.com/v1/me/player/pause";
      if (!nowPlaying.playing) {
        url = "https://api.spotify.com/v1/me/player/play";
        dispatch({
          type: "PLAYBACK_RESUMED",
        });
      } else {
        dispatch({
          type: "PLAYBACK_PAUSED",
        });
      }
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          device_id: spotifyPlayer._options.id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (!response.ok) {
          console.log(response);
          errorHandler("Could not play or pause!");
        }
      });
    });
  };

  // TODO: this is a bit of an ugly type hack
  let myWindow = window as any;
  myWindow.onSpotifyWebPlaybackSDKReady = async () => {
    let interval = null;
    let stop = false;
    let paused = false;
    const player = new myWindow.Spotify.Player({
      name: process.env.brandName,
      getOAuthToken: (cb: (token: string) => void) => {
        fetch("/api/auth/session")
          .then((response) => {
            if (!response.ok) {
              errorHandler("Could not fetch session");
              throw "Could not fetch session";
            }
            return response.json();
          })
          .then((data) => {
            const token = data?.user?.accessToken;
            cb(token);
          });
      },
    });

    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      dispatch({
        type: "SET_ERROR",
        payload: {
          errors: {
            initError: true,
          },
        },
      });
      dispatch({ type: "SET_PLAYER", payload: player });
    });
    player.addListener("authentication_error", ({ message }) => {
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

        dispatch({
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
        dispatch({
          type: "SET_PLAYING_TRACK",
          payload: currentTrack,
        });
      }

      if (!state.paused && interval) {
        return;
      }

      if (state.paused) {
        dispatch({
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
              dispatch({
                type: "PLAYBACK_RESUMED",
              });
            }

            dispatch({
              type: "UPDATE_MS_PLAYED",
              data: state.position,
            });
          });
        }, 1000);
      }
    });

    player.addListener("ready", ({ device_id }) => {
      dispatch({ type: "SET_PLAYER", payload: player });
    });

    player.connect();
  };

  loadSpotifyPlayer();

  const fetchTracks = (offset, limit) => {
    spotifyPlayer?._options?.getOAuthToken((token: string) => {
      fetch(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
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
            console.log(response);
            errorHandler("Could not get album list");
          }
        })
        .then((data) => {
          const fetchedArtists = artistsAndAlbums;
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
            dispatch({ type: "SET_ARTISTS", payload: fetchedArtists });
          });
          if (data.offset + data.limit > data.total) {
            const getRandomArtist = () =>
              Object.keys(artistsAndAlbums)[
                Math.floor(Math.random() * Object.keys(artistsAndAlbums).length)
              ];
            setRandomArtists([getRandomArtist(), getRandomArtist()]);
            setLoading(false);
            return;
          }
          dispatch({
            type: "UPDATE_FETCHED",
            payload: {
              limit: 50,
              offset: data.offset + data.limit,
              total: data.total,
            },
          });
          //fetchTracks();
        })
        .catch((err) => console.error(err));
    });
  };
  const fetchDevices = () => {
    spotifyPlayer?._options?.getOAuthToken((token: string) => {
      fetch(`https://api.spotify.com/v1/me/player/devices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.log(response);
            errorHandler("Could not get device list");
          }
        })
        .then((data) => {
          dispatch({ type: "SET_DEVICES", payload: data });
        })
        .catch((err) => console.error(err));
    });
  };
  useEffect(() => {
    const { offset, limit } = fetchStatus;
    fetchTracks(offset, limit);
  }, [spotifyPlayer, fetchStatus]);

  useEffect(() => {
    fetchDevices();
  }, [spotifyPlayer]);

  if (initError) {
    return (
      <div className="grid h-full place-items-center">
        <h1 className="text-3xl font-bold text-brand-grey-50">
          Couldn't initialise - probably your browser does not support{" "}
          {process.env.brandName} yet :(
        </h1>
      </div>
    );
  }
  return (
    <>
      {loading && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-8xl text-brand-500">
            <EqualizerIcon />
          </span>
        </div>
      )}
      {!loading && (
        <div className="flex flex-col flex-grow h-full">
          <div className="flex items-stretch flex-grow w-full h-full">
            <div className="w-1/5 h-full">
              <div className="flex flex-col h-full">
                <div className="max-h-full overflow-hidden">
                  <ArtistSearch
                    artists={artistsAndAlbums}
                    loading={loading}
                    randomArtists={randomArtists}
                    playWithSpotify={playWithSpotify}
                  />
                </div>
                <div className="flex-shrink-0 px-2 pb-4">
                  <RecordPlayer nowPlaying={nowPlaying} pause={pause} />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-4/5 h-full bg-brand-grey-800">
              <CoverFlow
                artists={artistsAndAlbums}
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
      )}
      {error && <ErrorBar errorMessage={errorMessage} />}
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
