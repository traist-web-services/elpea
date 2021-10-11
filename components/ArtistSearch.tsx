import { useState, useContext, memo, useMemo } from "react";

import SearchIcon from "@components/Icons/SearchIcon";

import { DispatchContext, StateContext } from "@contexts/AppContext";
import useSpotify from "@hooks/useSpotify";

function ArtistSearch() {
  const [filter, setFilter] = useState("");
  const { artistsAndAlbums, loading, spotifyPlayer } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const { play } = useSpotify;

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

  const artistList = Object.keys(artistsAndAlbums).sort((a, b) =>
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
  const getRandomArtist = useMemo(() => {
    return Object.keys(artistsAndAlbums)[
      Math.floor(Math.random() * Object.keys(artistsAndAlbums).length)
    ];
  }, []);

  if (artistsAndAlbums) {
    const artistList = Object.keys(artistsAndAlbums);
    const randomArtist =
      artistList[Math.ceil(artistList.length * Math.random())];
    if (randomArtist) {
      const randomAlbum =
        artistsAndAlbums[randomArtist][
          Math.floor(artistsAndAlbums[randomArtist].length * Math.random())
        ];
      if (randomAlbum) {
        spotifyId = randomAlbum.spotifyId;
      }
    }
  }

  const playRandom = async () => {
    const { error, data } = await play({
      uri: spotifyId,
      player: spotifyPlayer,
    });
    if (error) {
      dispatch({ type: "SET_ERROR", payload: error });
      return;
    }
    dispatch({ type: "SET_PLAYING_ALBUM", payload: data });
  };

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
        placeholder={loading ? "" : `eg: ${getRandomArtist}`}
        className="px-4 py-1 rounded-full outline-none bg-brand-grey-50 text-brand-grey-900"
        onChange={(e) => setFilter(e.target.value.toLowerCase())}
      />
      <button
        className="px-4 py-1 my-4 text-sm font-bold tracking-widest uppercase transition-colors duration-200 rounded-full bg-brand-700 hover:bg-brand-500 text-brand-grey-50"
        onClick={playRandom}
      >
        Random
      </button>
      <ul className="h-full overflow-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-brand-700">
        {loading && <li className="h-full">Loading...</li>}
        {filteredArtistList.length === 0 && (
          <li className="py-1 transition-colors duration-200 cursor-pointer hover:text-brand-grey-50 2xl:text-xl">
            No artists found
          </li>
        )}
        {!loading &&
          filteredArtistList.map((artist) => (
            <li
              onClick={() => scrollIn(artist)}
              key={artist}
              className="py-1 transition-colors duration-200 cursor-pointer hover:text-brand-grey-50 2xl:text-xl"
            >
              {artist}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default memo(ArtistSearch);
