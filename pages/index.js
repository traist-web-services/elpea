import { useReducer, memo } from "react";

import Head from "next/head";
import { useSession } from "next-auth/client";

import NavBar from "@components/NavBar";
import Landing from "@components/Landing";
import NoPremium from "@components/NoPremium";
import App from "@components/App";

import useSpotify from "@hooks/useSpotify";
import { StateContext, DispatchContext } from "@contexts/AppContext";

function reducer(state, action) {
  switch (action.type) {
    case "SET_DEVICES": {
      return {
        ...state,
        devices: {
          deviceList: action.payload,
          errorFetching: false,
          loading: false,
        },
      };
    }
    case "SET_PLAYER": {
      return {
        ...state,
        spotifyPlayer: action.payload,
      };
    }
    case "SET_ERROR": {
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload,
        },
      };
    }
    case "CLEAR_ERROR": {
      return {
        ...state,
        error: {
          ...state.error,
          error: false,
          message: null,
        },
      };
    }
    case "SET_PLAYING_ALBUM": {
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          playing: true,
          paused: false,
          album: action.payload,
        },
      };
    }
    case "SET_PLAYING_TRACK": {
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          playing: true,
          paused: false,
          track: action.payload,
        },
      };
    }
    case "UPDATE_MS_PLAYED": {
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          msPlayed: action.payload,
          playing: action.payload !== state?.nowPlaying?.msPlayed,
          paused: action.payload === state?.nowPlaying?.msPlayed,
        },
      };
    }
    case "PLAYBACK_PAUSED": {
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          paused: true,
          playing: false,
        },
      };
    }
    case "PLAYBACK_RESUMED": {
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          paused: false,
          playing: true,
        },
      };
    }
    case "PLAYBACK_STOPPED": {
      return {
        ...state,
        nowPlaying: initialState.nowPlaying,
      };
    }
    case "UPDATE_FETCHED": {
      return {
        ...state,
        fetchStatus: action.payload,
      };
    }
    case "SET_ARTISTS": {
      return {
        ...state,
        artistsAndAlbums: {
          ...state.artistsAndAlbums,
          ...action.payload,
        },
      };
    }
    case "SET_LOADING": {
      return {
        ...state,
        loading: action.payload,
      };
    }
    default:
      throw new Error("You dispatched an invalid action type");
  }
}

const initialState = {
  devices: {
    deviceList: [],
    errorFetching: null,
    loading: null,
  },
  spotifyPlayer: {},
  errors: {
    initError: null,
    error: false,
    message: null,
  },
  nowPlaying: {
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
  },
  fetchStatus: {
    limit: 50,
    offset: 0,
    total: 1,
  },
  artistsAndAlbums: {},
  loading: true,
};

function Home() {
  const [session, loading] = useSession();
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <Head>
        <title>{process.env.brandName}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </Head>

      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          <div className="flex flex-col h-screen overflow-hidden bg-brand-grey-900 text-brand-grey-300">
            {session && <NavBar session={session} />}
            <main className="flex-grow h-full overflow-hidden">
              <div className="h-full">
                {!session && <Landing />}
                {session && session.user.product !== "premium" && <NoPremium />}
                {session &&
                  session.user &&
                  session.user.product === "premium" && (
                    <App session={session} />
                  )}
              </div>
            </main>
            <footer className="flex flex-col items-end justify-center flex-shrink-0 h-8 px-4 border-t-4 bg-brand-700 border-brand-400 text-brand-grey-50">
              <a href="https://traist.co.uk" target="_blank">
                &copy; Traist Web Services 2021
              </a>
            </footer>
          </div>
        </StateContext.Provider>
      </DispatchContext.Provider>
    </>
  );
}

export default memo(Home);
