import { memo, useContext, useState } from "react";
import styles from "@styles/LP.module.scss";

import useSpotify from "@hooks/useSpotify";
import { DispatchContext } from "@contexts/AppContext";

interface LPProps {
  previewImage: string;
  spotifyId: string;
  name: string;
  spotifyPlayer: any;
}

function LP({ previewImage, spotifyId, name, spotifyPlayer }: LPProps) {
  const [showLP, setShowLP] = useState(false);
  const dispatch = useContext(DispatchContext);
  const { play } = useSpotify;
  const handleClick = async () => {
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
    <li onClick={handleClick} className="w-full px-3 mt-2">
      <div className="relative">
        <div
          className={`transition-transform duration-200 transform bg-black absolute top-0 left-0 w-32 h-32 rounded-full z-0 ${
            showLP ? "-translate-x-4" : ""
          }`}
        ></div>
        <div
          className={`${styles.lp} relative flex-shrink-0 w-32 h-32 bg-brand-grey-900 shadow-lg cursor-pointer group overflow-hidden`}
          onMouseOver={() => setShowLP(true)}
          onMouseOut={() => setShowLP(false)}
        >
          <img
            src={previewImage}
            id={spotifyId}
            loading="lazy"
            className="relative max-w-full rounded spotify-album"
          />
        </div>
      </div>

      <div
        className="h-10 max-w-full my-2 overflow-hidden text-sm"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          lineClamp: 2,
          WebkitLineClamp: 2,
        }}
      >
        {name}
      </div>
    </li>
  );
}

export default memo(LP);
