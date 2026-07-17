import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "./CoverLetter.module.css";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api"; // Use Vite env variable or fallback


export default function CoverLetter() {

  // ==========================
  // Form Data
  // ==========================
  const [form, setForm] = useState({
    company: "",
    jobTitle: "",
    skills: "",
    experience: "",
  });

  // Generated AI Cover Letter
  const [coverLetter, setCoverLetter] = useState("");

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // ==========================
  // Handle Input
  // ==========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Generate Cover Letter
  // ==========================
  const generateLetter = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setCoverLetter("");

    try {

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/documents/cover-letter`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCoverLetter(response.data.coverLetter);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to generate cover letter."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
      <Navbar />

      <main className={styles.container}>

        <h1>AI Cover Letter Generator</h1>

        <form
          className={styles.form}
          onSubmit={generateLetter}
        >

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="jobTitle"
            placeholder="Job Title"
            value={form.jobTitle}
            onChange={handleChange}
            required
          />

          <textarea
            name="skills"
            placeholder="Your Skills"
            rows="4"
            value={form.skills}
            onChange={handleChange}
            required
          />

          <textarea
            name="experience"
            placeholder="Your Experience"
            rows="5"
            value={form.experience}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Generate Cover Letter
          </button>

        </form>

        {loading && (
          <LoadingSpinner text="Generating..." />
        )}

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        {coverLetter && (

          <div className={styles.result}>

            <h2>Your Cover Letter</h2>

            <textarea
              value={coverLetter}
              readOnly
              rows="18"
            />

            <button
              onClick={() =>
                navigator.clipboard.writeText(coverLetter)
              }
            >
              Copy
            </button>

          </div>

        )}

      </main>

      <Footer />
    </>
  );

}