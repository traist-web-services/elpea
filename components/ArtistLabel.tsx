export default function ArtistLabel({ children }) {
  return (
    <h2 className="sticky left-0 inline ml-4 text-2xl whitespace-nowrap">
      {children}
    </h2>
  );
}
