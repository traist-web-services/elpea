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
      <section className="flex flex-col h-full pb-4 pl-10">
        <TrackList nowPlaying={nowPlaying} />
      </section>
    </>
  );
}
