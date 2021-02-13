import LP from "@components/LP";
import ArtistLabel from "@components/ArtistLabel";

interface CoverFlowProps {
  artists: any;
  loading: boolean;
  fetchStatus: {
    limit: number;
    offset: number;
    total: number;
  };
  playWithSpotify: (uri: string) => void;
}
export default function CoverFlow({
  artists,
  loading,
  fetchStatus,
  playWithSpotify,
}: CoverFlowProps) {
  const artistList = Object.keys(artists).sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" })
  );

  const scrollIn = (artist) => {
    console.log("Scroll in", artist);
    console.log(document.querySelector(`#${toHex(artist)}`));
    document
      .querySelector(`#${toHex(artist)}`)
      .scrollIntoView({ behavior: "smooth", block: "end", inline: "start" });
  };
  function toHex(str) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return "a" + result;
  }

  return (
    <>
      <div className="pl-4 rounded">
        <h1 className="py-2 pb-4 text-3xl font-bold text-brand-grey-50">
          Your Album Collection
        </h1>
        <ul className="flex w-full overflow-x-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-brand-700">
          {loading && (
            <div>
              <h1 className="text-4xl">
                Loading{" "}
                {Math.floor(100 * (fetchStatus.offset / fetchStatus.total))} %
              </h1>
            </div>
          )}
          {!loading &&
            artistList.map((artist) => {
              return (
                <li
                  className="relative px-2 pt-2 mb-1 mr-2 rounded-xl bg-brand-grey-700"
                  key={artist}
                  id={toHex(artist)}
                >
                  <ArtistLabel>{artist}</ArtistLabel>
                  <ul className="flex">
                    {artists[artist].map((album) => {
                      return (
                        <LP
                          previewImage={album.previewImage}
                          spotifyId={album.spotifyId}
                          key={album.spotifyId}
                          playWithSpotify={playWithSpotify}
                          name={album.name}
                        />
                      );
                    })}
                  </ul>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
