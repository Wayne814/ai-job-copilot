import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Portfolio.module.css";

export default function Portfolio() {
  const [bio, setBio] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!bio.trim()) return;
    
    setLoading(true);
    setPortfolio("");

    try {
      const response = await axios.post(
        "http://localhost:8000/portfolio/generate",
        { bio }
      );
      setPortfolio(response.data.portfolio);
    } catch (err) {
      alert("Failed to generate portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Portfolio Generator</h1>
          <p>Tell us about yourself and get a stunning portfolio description.</p>

          <div className={styles.form}>
            <textarea
              rows="8"
              placeholder="Tell us about your skills, experience, and achievements..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            
            <button
              className={`${styles.button} ${loading ? styles.loading : ""}`}
              onClick={generate}
              disabled={loading || !bio.trim()}
            >
              {loading ? "Generating..." : "Generate Portfolio"}
            </button>

            {portfolio && (
              <div className={styles.result}>
                <h3>Your Portfolio:</h3>
                <pre>{portfolio}</pre>
                <button
                  className={styles.copyBtn}
                  onClick={() => navigator.clipboard.writeText(portfolio)}
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}