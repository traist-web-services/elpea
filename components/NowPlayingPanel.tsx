import TrackList from "./TrackList";

export default function NowPlayingPanel() {
  return (
    <>
      <section className="flex flex-col h-full pb-4 pl-10">
        <TrackList />
      </section>
    </>
  );
}
