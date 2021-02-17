import { memo } from "react";

function ArtistLabel({ children }) {
  return (
    <h2 className="sticky left-0 inline ml-2 text-xl font-bold 2xl:text-2xl text-brand-grey-100 whitespace-nowrap">
      {children}
    </h2>
  );
}

export default memo(ArtistLabel);
