import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import TemplateSelector from "../components/TemplateSelector";

import styles from "./Dashboard.module.css";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api"; // Use Vite env variable or fallback


export default function Dashboard() {

  // =========================
  // State
  // =========================
  const [userData, setUserData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load user + documents
  // =========================
  useEffect(() => {

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // Redirect if not logged in
    if (!token || !user) {
      window.location.href = "/login";
      return;
    }

    setUserData(JSON.parse(user));

    // Fetch real documents from backend
    const fetchDocuments = async () => {
      try {

        const response = await axios.get(
          `${API_BASE_URL}/api/documents/my-documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDocuments(response.data);

      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();

  }, []);

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  // =========================
  // Loading state
  // =========================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.loadingContainer}>
          <LoadingSpinner text="Loading Dashboard..." />
        </div>
        <Footer />
      </>
    );
  }

  // =========================
  // Time-based greeting
  // =========================
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <>
      <Navbar />

      <main className={styles.dashboardMain}>

        <div className={styles.container}>

          {/* =========================
              SIDEBAR
          ========================= */}
          <aside className={styles.sidebar}>

            <div className={styles.userProfile}>

              <div className={styles.avatar}>
                {(userData?.name || "")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className={styles.userInfo}>
                <h4>{userData?.name}</h4>
                <p>{userData?.email}</p>
              </div>

            </div>

            {/* Navigation */}
            <nav className={styles.navMenu}>

              <Link to="/resume" className={styles.navItem}>📄 Resume Builder</Link>

              <Link to="/cover-letter" className={styles.navItem}>✉️ Cover Letter</Link>

              <Link to="/portfolio" className={styles.navItem}>💼 Portfolio</Link>

              <Link to="/jobs" className={styles.navItem}>💼 Job Search</Link>

              <Link to="/pricing" className={styles.navItem}>💳 Upgrade Plan</Link>

            </nav>

          </aside>

          {/* =========================
              MAIN CONTENT
          ========================= */}
          <section className={styles.content}>

            {/* Header */}
            <header className={styles.header}>

              <h2>
                {greeting}, {userData?.name} 👋
              </h2>

              <p>Welcome back to your AI Career Dashboard</p>

              <div className={styles.creditBadge}>
                💎 {userData?.credits} Credits
              </div>

            </header>

            {/* =========================
                STATS SECTION
            ========================= */}
            <div className={styles.statsGrid}>

              <div className={styles.statCard}>
                <h3>{documents.length}</h3>
                <p>Documents</p>
              </div>

              <div className={styles.statCard}>
                <h3>
                  {documents.filter(d => d.type === "resume").length}
                </h3>
                <p>Resumes</p>
              </div>

              <div className={styles.statCard}>
                <h3>
                  {documents.filter(d => d.type === "cover-letter").length}
                </h3>
                <p>Cover Letters</p>
              </div>

              <div className={styles.statCard}>
                <h3>
                  {documents.filter(d => d.type === "portfolio").length}
                </h3>
                <p>Portfolios</p>
              </div>

            </div>


            {/* =========================
                RECENT DOCUMENTS
            ========================= */}
            <div className={styles.section}>

              <h3>Recent Documents</h3>

              {documents.length === 0 ? (
                <p>No documents yet. Start creating!</p>
              ) : (
                <div className={styles.docsGrid}>

                  {documents.map((doc) => (

                    <div key={doc._id} className={styles.docCard}>

                      <div className={styles.docIcon}>

                        {doc.type === "resume" && "📄"}
                        {doc.type === "cover-letter" && "✉️"}
                        {doc.type === "portfolio" && "💼"}

                      </div>

                      <div className={styles.docInfo}>

                        <h4>{doc.title}</h4>

                        <span>{doc.type}</span>

                        <small>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </small>

                      </div>

                    </div>

                  ))}

                </div>
              )}

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}