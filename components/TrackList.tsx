import EqualizerIcon from "@components/Icons/EqualizerIcon";

export default function TrackList({
  playingTrack,
  playingAlbum = { name: "", tracks: [], artist: "" },
}) {
  return (
    <>
      <h2 className="text-white text-3xl mb-4">
        {playingAlbum.name} ({playingAlbum.artist})
      </h2>
      <ol className="text-white text-xl list-decimal">
        {playingAlbum.tracks.map((track, index) => {
          return (
            <li className="flex items-center">
              {track.id === playingTrack.id ? (
                <span className="mr-2 -ml-6">
                  <EqualizerIcon />
                </span>
              ) : (
                ""
              )}{" "}
              {index + 1}. {track.name} -{" "}
              {Math.floor(track.duration_ms / 60000)}:
              {("" + (Math.floor(track.duration_ms / 1000) % 60)).length === 2
                ? Math.floor(track.duration_ms / 1000) % 60
                : "0" + (Math.floor(track.duration_ms / 1000) % 60)}
              s
            </li>
          );
        })}
      </ol>
    </>
  );
}
