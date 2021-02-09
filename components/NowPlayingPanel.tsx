import RecordPlayer from "@components/RecordPlayer";
import TrackList from "./TrackList";

interface NowPlayingPanelProps {
  playing: boolean;
  labelImage: string;
  percentageProgress: number;
  playingAlbum?: {
    name: string;
    tracks: any[];
  };
  playingTrack?: any;
  pause: () => void;
}
export default function NowPlayingPanel({
  playing,
  labelImage,
  percentageProgress,
  playingAlbum,
  playingTrack,
  pause,
}: NowPlayingPanelProps) {
  return (
    <>
      <section className="grid grid-cols-2 gap-4 my-8 items-stretch auto-cols-fr">
        <div className="flex justify-center">
          <RecordPlayer
            playing={playing}
            labelImage={labelImage}
            percentageProgress={percentageProgress}
            pause={pause}
          />
        </div>
        <div className="">
          <TrackList playingAlbum={playingAlbum} playingTrack={playingTrack} />
        </div>
      </section>
    </>
  );
}
