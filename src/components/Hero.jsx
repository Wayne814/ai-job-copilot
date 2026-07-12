import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.css";

export default function Hero() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleCTA = () => {
    if (token) {
      navigate("/cover-letter");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>
          Create Professional <br />
          Resumes, Cover Letters & Portfolios <br />
          <span className={styles.highlight}>in Minutes</span>
        </h1>
        <p>
          AI-powered platform helping students land internships and jobs faster.
        </p>
        <button className={styles.ctaButton} onClick={handleCTA}>
          Get Started Free
        </button>
      </div>
    </section>
  );
}