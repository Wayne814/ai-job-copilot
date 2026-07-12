import styles from "./LoadingSpinner.module.css";
export default function LoadingSpinner({ size = "medium", text = "Loading..." }) {
  const sizeClasses = { small: styles.small, medium: styles.medium, large: styles.large };
  return (
    <div className={`${styles.container} ${sizeClasses[size]}`}>
      <div className={styles.spinner}></div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}