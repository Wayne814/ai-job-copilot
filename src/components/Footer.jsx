import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerLinks = [{ to: "/", label: "Home" }, { to: "/pricing", label: "Pricing" }];
  const socialLinks = [
    { icon: "🐦", url: "https://twitter.com", label: "Twitter" },
    { icon: "💼", url: "https://linkedin.com", label: "LinkedIn" },
    { icon: "📸", url: "https://instagram.com", label: "Instagram" },
    { icon: "🐙", url: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.footerTop}>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              {footerLinks.map((link, index) => (
                <li key={index}><Link to={link.to}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Connect</h4>
            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={social.label}>{social.icon}</a>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© {currentYear} Job Copilot. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.link}>Privacy Policy</a>
            <a href="#" className={styles.link}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}