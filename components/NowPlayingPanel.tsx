import RecordPlayer from "@components/RecordPlayer";
import TrackList from "./TrackList";

interface NowPlayingPanelProps {
  nowPlaying: any;
  pause: () => void;
}
export default function NowPlayingPanel({
  nowPlaying,
  pause,
}: NowPlayingPanelProps) {
  return (
    <>
      <section className="grid items-start grid-cols-2 gap-4 mt-2 auto-cols-fr">
        <div className="flex items-center justify-center flex-grow h-full">
          <RecordPlayer nowPlaying={nowPlaying} pause={pause} />
        </div>
        <div className="max-h-full">
          <TrackList nowPlaying={nowPlaying} />
        </div>
      </section>
    </>
  );
}
