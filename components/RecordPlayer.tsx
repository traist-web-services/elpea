import { useContext } from "react";

import styles from "@styles/RecordPlayer.module.scss";
import { StateContext } from "@contexts/AppContext";

export default function RecordPlayer() {
  const {
    nowPlaying: {
      playing,
      msPlayed,
      album: { duration, image, tracks },
      track,
    },
  } = useContext(StateContext);
  const minAngle = 14; // Note, technically 12.5
  const maxAngle = 36; // Technically 37.5
  const difference = maxAngle - minAngle;
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
      ? minAngle + Math.min(totalPlayed / duration, 1) * difference
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
      </div>
    </>
  );
}
