import { useState } from "react";

interface LPProps {
  previewImage: string;
  spotifyId: string;
  playWithSpotify: (uri: string) => void;
}
export default function LP({
  previewImage,
  spotifyId,
  playWithSpotify,
}: LPProps) {
  const [showLP, setShowLP] = useState(false);
  return (
    <li
      className="group cursor-pointer relative flex-shrink-0 w-48 h-48 mx-4 shadow-lg"
      onMouseOver={() => setShowLP(true)}
      onMouseOut={() => setShowLP(false)}
      onClick={() => playWithSpotify(spotifyId)}
    >
      <img
        src={previewImage}
        id={spotifyId}
        loading="lazy"
        className="max-w-full z-10 relative spotify-album"
      />
      <div
        className={`transition-transform duration-200 transform bg-black absolute top-0 left-0 w-full h-full rounded-full z-0 ${
          showLP ? "-translate-x-6" : ""
        }`}
      ></div>
    </li>
  );
}
