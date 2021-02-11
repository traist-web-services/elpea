import { useState } from "react";

export default function ArtistSearch({
  artists,
  loading,
  randomArtists,
  playWithSpotify,
}) {
  const [filter, setFilter] = useState("");
  const scrollIn = (artist: string) => {
    document
      .querySelector(`#${toHex(artist)}`)
      .scrollIntoView({ behavior: "smooth", block: "end", inline: "start" });
  };

  function toHex(str: string) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return "a" + result;
  }

  const artistList = Object.keys(artists).sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" })
  );

  const filteredArtistList = artistList.filter((el) => {
    const artist = el.toLowerCase();
    if (!filter) {
      return true;
    }
    if (artist.substr(0, filter.length) === filter.toLowerCase()) {
      return true;
    }
    return false;
  });

  let spotifyId = "";
  if (artists) {
    const artistList = Object.keys(artists);
    const randomArtist =
      artistList[Math.ceil(artistList.length * Math.random())];
    if (randomArtist) {
      const randomAlbum =
        artists[randomArtist][
          Math.floor(artists[randomArtist].length * Math.random())
        ];
      if (randomAlbum) {
        spotifyId = randomAlbum.spotifyId;
      }
    }
  }

  return (
    <div className="flex flex-col h-full p-4 pt-2">
      <h2 className="mb-2 text-2xl text-white">Search</h2>
      <input
        type="text"
        placeholder={!loading && `eg: ${randomArtists[0]}`}
        className="px-4 py-2 rounded-full outline-none bg-brand-200 text-brand-grey-900"
        onChange={(e) => setFilter(e.target.value.toLowerCase())}
      />
      <button
        className="px-4 py-2 my-4 rounded-full bg-brand-700 hover:bg-brand-500"
        onClick={() => playWithSpotify(spotifyId)}
      >
        Random
      </button>
      <div className="p-4 bg-brand-700 rounded-3xl">
        <ul className="flex-grow overflow-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-brand-700 bg-brand-700">
          {loading && <li className="h-full">Loading...</li>}
          {!loading &&
            filteredArtistList.map((artist) => (
              <li
                onClick={() => scrollIn(artist)}
                key={artist}
                className="py-1 cursor-pointer"
              >
                {artist}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
