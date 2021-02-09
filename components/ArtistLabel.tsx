export default function ArtistLabel({ children }) {
  return (
    <div
      className="flex-shrink-0 w-12 h-48 mx-1 bg-red-500 flex items-center justify-center shadow-lg"
      style={{ writingMode: "sideways-lr", textOrientation: "mixed" }}
    >
      {children}
    </div>
  );
}
