import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setToken(null);
      navigate("/login");
      setIsMenuOpen(false);
    }
  };

  const handleGetStarted = () => {
    setIsMenuOpen(false);
    if (token) {
      navigate("/cover-letter");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
          <span className={styles.logoIcon}>🚀</span>
          <span className={styles.logoText}>JobCopilot</span>
        </Link>

        <div className={`${styles.desktopMenu} ${isMenuOpen ? styles.active : ""}`}>
          {!token ? (
            <>
              <Link to="/pricing">Pricing</Link>
              <button onClick={handleGetStarted} className={styles.getStartBtn}>
                Get Started
              </button>
            </>
          ) : (
            <>
              <Link to="/cover-letter" onClick={() => setIsMenuOpen(false)}>Cover Letter</Link>
              <Link to="/resume" onClick={() => setIsMenuOpen(false)}>Resume Builder</Link>
              <Link to="/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          )}
        </div>

        <div 
          className={`${styles.mobileToggle} ${isMenuOpen ? styles.active : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {!token ? (
            <>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
              <button onClick={handleGetStarted} className={styles.mobileGetStarted}>
                Get Started
              </button>
            </>
          ) : (
            <>
              <Link to="/cover-letter" onClick={() => setIsMenuOpen(false)}>Cover Letter</Link>
              <Link to="/resume" onClick={() => setIsMenuOpen(false)}>Resume Builder</Link>
              <Link to="/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className={styles.mobileLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}