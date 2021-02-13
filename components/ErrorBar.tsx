import ErrorIcon from "./Icons/ErrorIcon";

export default function ErrorBar({ errorMessage }) {
  return (
    <div className="absolute top-0 left-0 flex items-center w-screen h-24 px-8 py-8 text-lg bg-brand-red-500 text-brand-grey-50">
      <span className="flex-grow-0 h-10">
        <ErrorIcon />
      </span>{" "}
      <span className="ml-4">{errorMessage}</span>
    </div>
  );
}
