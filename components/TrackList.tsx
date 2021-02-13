import EqualizerIcon from "@components/Icons/EqualizerIcon";

export default function TrackList({ nowPlaying }) {
  const { album, track, playing, paused } = nowPlaying;
  if (!album.name) {
    return <></>;
  }
  return (
    <>
      <h2 className="my-2 text-2xl font-bold text-brand-grey-50">
        {album.name} ({album.artist})
      </h2>
      <div className="flex-grow h-0">
        <ol className="flex flex-col flex-wrap w-full h-full ml-4 list-decimal">
          {album.tracks.map((albumTrack: any, index: number) => {
            return (
              <li
                key={albumTrack.id}
                className=""
                style={{
                  display: "inline-list-item",
                }}
              >
                <div className="relative flex items-center">
                  {albumTrack.name} -{" "}
                  {Math.floor(albumTrack.duration_ms / 60000)}:
                  {("" + (Math.floor(albumTrack.duration_ms / 1000) % 60))
                    .length === 2
                    ? Math.floor(albumTrack.duration_ms / 1000) % 60
                    : "0" + (Math.floor(albumTrack.duration_ms / 1000) % 60)}
                  s
                  {albumTrack.name === track?.name && playing && !paused ? (
                    <span className="absolute top-0 ml-2 -left-14">
                      <EqualizerIcon />
                    </span>
                  ) : (
                    ""
                  )}{" "}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
