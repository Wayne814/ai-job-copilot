import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "./Auth.module.css";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api"; // Use Vite env variable or fallback

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setLoading(false);
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      // 1. Register with Backend
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        { name, email, password }
      );

      if (response.data && response.data.token) {
        const token = response.data.token;
        const userId = response.data.user?._id;

        // 2. Save Token and Initial Credits to LocalStorage
        // We assume the backend returns user data or we set default credits here
        const initialCredits = 5; // Give 5 free credits on signup
        
        const userData = {
          id: userId,
          name: name,
          email: email,
          credits: initialCredits
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setSuccess("Account created successfully! Redirecting to dashboard...");
        
        setTimeout(() => {
          navigate("/dashboard"); // Redirect to Dashboard
        }, 2000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      let message = "Registration failed. Please try again.";
      if (err.response) {
        message = err.response.data?.message || err.response.data?.error || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.authMain}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <div className={styles.logo}>👤</div>
              <h1>Create Account</h1>
              <p>Join us to start generating professional cover letters</p>
            </div>

            <form className={styles.authForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className={styles.input}
                  autoComplete="name"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className={styles.input}
                  autoComplete="email"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={styles.input}
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className={styles.input}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className={styles.errorMessage} role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className={styles.successMessage}>
                  {success}
                </div>
              )}

              <button
                type="button"
                onClick={handleRegister}
                className={`${styles.button} ${loading ? styles.loading : ""}`}
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className={styles.spinnerIcon}></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className={styles.authFooter}>
              <p>Already have an account?</p>
              <Link to="/login" className={styles.registerLink}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}