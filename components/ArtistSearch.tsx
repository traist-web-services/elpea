import { useState } from "react";

import SearchIcon from "@components/Icons/SearchIcon";

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
    <div className="flex flex-col h-full px-4">
      <h2 className="flex items-center py-5 font-bold 2xl:text-2xl text-brand-grey-50">
        <span className="h-4 mr-2 2xl:h-8">
          <SearchIcon />
        </span>
        Search
      </h2>
      <input
        type="text"
        placeholder={loading ? "" : `eg: ${randomArtists[0]}`}
        className="px-4 py-1 rounded-full outline-none bg-brand-grey-50 text-brand-grey-900"
        onChange={(e) => setFilter(e.target.value.toLowerCase())}
      />
      <button
        className="px-4 py-1 my-4 text-sm font-bold tracking-widest uppercase transition-colors duration-200 rounded-full bg-brand-700 hover:bg-brand-500 text-brand-grey-50"
        onClick={() => playWithSpotify(spotifyId)}
      >
        Random
      </button>
      <ul className="flex-grow h-full overflow-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-brand-700">
        {loading && <li className="h-full">Loading...</li>}
        {!loading &&
          filteredArtistList.map((artist) => (
            <li
              onClick={() => scrollIn(artist)}
              key={artist}
              className="py-1 transition-colors duration-200 cursor-pointer hover:text-brand-grey-50"
            >
              {artist}
            </li>
          ))}
      </ul>
    </div>
  );
}
