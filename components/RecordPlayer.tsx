import styles from "@styles/RecordPlayer.module.scss";

interface RecordPlayerProps {
  nowPlaying: any;
  pause: () => void;
}
export default function RecordPlayer({ nowPlaying, pause }: RecordPlayerProps) {
  const minAngle = 14;
  const maxAngle = 35;
  const difference = maxAngle - minAngle;
  const {
    playing,
    msPlayed,
    album: { duration, image, tracks },
    track,
  } = nowPlaying;
  // TODO: Fix the type here
  const trackIndex = tracks.findIndex((el: any) => {
    return el.name === track.name;
  });
  const playedTracks = tracks.slice(0, trackIndex);
  const totalPlayed =
    msPlayed +
    playedTracks.reduce((acc: number, curr: any) => acc + curr.duration_ms, 0);
  const rotationDegree =
    playing && totalPlayed > 0
      ? minAngle + (totalPlayed / duration) * difference
      : 0;
  return (
    <>
      <div className={`${styles.recordContainer}`}>
        <div
          className={`${styles.record}  ${playing ? styles.playing : ""}`}
        ></div>
        <div
          className={`${styles.recordLabel}  ${playing ? styles.playing : ""}`}
          style={{
            backgroundImage: `url('${image}')`,
          }}
        ></div>
        <div
          className={styles.recordArm}
          style={{
            transform: `rotate(${rotationDegree}deg)`,
          }}
        >
          <div className={styles.armPivot}></div>
          <div className={styles.arm}></div>
          <div className={styles.armElbow}>
            <div className={styles.tip}>
              <div className={styles.needle}></div>
            </div>
          </div>
        </div>
        <div
          className={styles.pauseButton}
          onClick={() => (playing ? pause() : "")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
