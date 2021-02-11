import EqualizerIcon from "@components/Icons/EqualizerIcon";

export default function TrackList({ nowPlaying }) {
  const { album, track, playing, paused } = nowPlaying;
  if (!album.name) {
    return <></>;
  }
  return (
    <>
      <h2 className="mb-4 text-4xl">
        {album.name} ({album.artist})
      </h2>
      <ol
        className="max-h-full text-xl"
        style={{
          columns: "auto 2",
        }}
      >
        {album.tracks.map((albumTrack: any, index: number) => {
          return (
            <li className="flex items-center" key={albumTrack.id}>
              {albumTrack.name === track?.name && playing && !paused ? (
                <span className="mr-2 -ml-6">
                  <EqualizerIcon />
                </span>
              ) : (
                ""
              )}{" "}
              {index + 1}. {albumTrack.name} -{" "}
              {Math.floor(albumTrack.duration_ms / 60000)}:
              {("" + (Math.floor(albumTrack.duration_ms / 1000) % 60))
                .length === 2
                ? Math.floor(albumTrack.duration_ms / 1000) % 60
                : "0" + (Math.floor(albumTrack.duration_ms / 1000) % 60)}
              s
            </li>
          );
        })}
      </ol>
    </>
  );
}
