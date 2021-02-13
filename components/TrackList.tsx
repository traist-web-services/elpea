import EqualizerIcon from "@components/Icons/EqualizerIcon";

export default function TrackList({ nowPlaying }) {
  const { album, track, playing, paused } = nowPlaying;
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
                className={`${
                  albumTrack.name === track?.name && playing && !paused
                    ? "absolute bg-brand-700 text-brand-grey-50 px-4 pl-2 py-2 rounded-full -ml-8 mr-10"
                    : ""
                } relative my-1 2xl:text-xl`}
                style={{
                  listStylePosition:
                    albumTrack.name === track?.name && playing && !paused
                      ? "inside"
                      : "outside",
                  display: "inline-list-item",
                }}
              >
                <span>
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
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
