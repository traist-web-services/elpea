import { useState } from "react";
import styles from "@styles/LP.module.scss";

interface LPProps {
  previewImage: string;
  spotifyId: string;
  name: string;
  playWithSpotify: (uri: string) => void;
}
export default function LP({
  previewImage,
  spotifyId,
  name,
  playWithSpotify,
}: LPProps) {
  const [showLP, setShowLP] = useState(false);
  return (
    <li onClick={() => playWithSpotify(spotifyId)} className="w-full px-3 mt-2">
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
