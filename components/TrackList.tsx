import { StateContext } from "@contexts/AppContext";
import { useContext, memo } from "react";

function TrackList() {
  const {
    nowPlaying: { album, track, playing, paused },
  } = useContext(StateContext);
  if (!album.name) {
    return <></>;
  }
  return (
    <>
      <h2 className="my-2 text-2xl font-bold text-brand-grey-50 2xl:text-4xl">
        {album.name} ({album.artist})
      </h2>
      <div className="flex-grow h-0 max-w-full">
        <ol className="inline-flex flex-col flex-wrap w-full h-full ml-4 list-decimal transition-all duration-200">
          {album.tracks.map((albumTrack: any, index: number) => {
            return (
              <li
                key={albumTrack.id}
                className={`flex ${
                  albumTrack.name === track?.name
                    ? "absolute bg-brand-700 text-brand-grey-50 px-4 pl-2 py-2 rounded-full -ml-2 mr-4"
                    : ""
                } relative my-1 2xl:text-xl`}
                style={{
                  listStylePosition:
                    albumTrack.name === track?.name ? "inside" : "outside",
                }}
              >
                <div className="flex items-center">
                  {albumTrack.name === track?.name ? (
                    paused ? (
                      <>
                        <span className="mr-2 animate-pulse">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-12 h-12"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>{" "}
                      </>
                    ) : (
                      <>
                        <span className="mr-2 animate-pulse">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-12 h-12"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>{" "}
                      </>
                    )
                  ) : (
                    ""
                  )}
                  <span>
                    <span
                      className="inline-block"
                      style={{
                        width:
                          index >= 99 ? "3ch" : index >= 9 ? "2ch" : "1.5ch",
                      }}
                    >
                      {index + 1}.
                    </span>{" "}
                    {albumTrack.name} -{" "}
                    {Math.floor(albumTrack.duration_ms / 60000)}
                  </span>
                  <span
                    className={`${
                      albumTrack.name === track?.name && playing && !paused
                        ? "animate-pulse"
                        : ""
                    }`}
                  >
                    :
                  </span>
                  <span>
                    {("" + (Math.floor(albumTrack.duration_ms / 1000) % 60))
                      .length === 2
                      ? Math.floor(albumTrack.duration_ms / 1000) % 60
                      : "0" + (Math.floor(albumTrack.duration_ms / 1000) % 60)}
                    s
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

export default memo(TrackList);
