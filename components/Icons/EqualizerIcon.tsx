import styles from "@styles/EqualizerIcon.module.scss";

export default function EqualizerIcon() {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs></defs>
      <g className={styles.iconEqualizerAnim} fill="currentColor">
        <rect
          className={`${styles.eq__bar} ${styles.eq__bar1}`}
          x="1"
          y="8"
          width="4"
          height="8"
        ></rect>
        <rect
          className={`${styles.eq__bar} ${styles.eq__bar2}`}
          id="eq2"
          x="6"
          y="1"
          width="4"
          height="15"
        ></rect>
        <rect
          className={`${styles.eq__bar} ${styles.eq__bar3}`}
          x="11"
          y="4"
          width="4"
          height="12"
        ></rect>
      </g>
    </svg>
  );
}
