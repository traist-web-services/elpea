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
      <section className="grid grid-cols-2 gap-4 my-8 items-stretch auto-cols-fr items-start">
        <div className="">
          <RecordPlayer nowPlaying={nowPlaying} pause={pause} />
        </div>
        <div className="">
          <TrackList nowPlaying={nowPlaying} />
        </div>
      </section>
    </>
  );
}
