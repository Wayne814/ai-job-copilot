import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "./Auth.module.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Optional: If you want to auto-login if token exists, you can check here
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !password) {
      setLoading(false);
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password }
      );

      if (response.data.token) {
        const token = response.data.token;
        const user = response.data.user || { name: email.split('@')[0], email: email };
        
        // 3. Save Token and User Data (including credits) to LocalStorage
        const userData = {
          id: user._id || 'unknown',
          name: user.name || user.username || email.split('@')[0],
          email: user.email || email,
          credits: user.credits || 0 // Ensure credits are saved
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setSuccess("Login successful! Redirecting...");
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      let message = "Login failed. Please check your credentials.";
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
              <div className={styles.logo}>🔐</div>
              <h1>Welcome Back</h1>
              <p>Sign in to continue generating cover letters</p>
            </div>

            <form onSubmit={handleLogin} className={styles.authForm}>
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
                  autoComplete="current-password"
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
                type="submit"
                className={`${styles.button} ${loading ? styles.loading : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinnerIcon}></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className={styles.authFooter}>
              <p>Don't have an account?</p>
              <Link to="/register" className={styles.registerLink}>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}