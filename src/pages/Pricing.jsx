import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Pricing.module.css";

const plans = [
  {
    title: "Free",
    price: 0,
    features: ["3 Resumes", "1 Cover Letter", "Basic Export"],
    cta: "Get Started"
  },
  {
    title: "Pro",
    price: 19,
    features: ["Unlimited Resumes", "Unlimited Cover Letters", "ATS Checker", "Priority Support"],
    popular: true,
    cta: "Go Pro"
  },
  {
    title: "Enterprise",
    price: 49,
    features: ["Everything in Pro", "Team Collaboration", "API Access", "Dedicated Manager"],
    cta: "Contact Sales"
  }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>Simple, Transparent Pricing</h1>
            <p>Choose the plan that works for you.</p>

            <div className={styles.toggle}>
              <span className={isAnnual ? "" : styles.active}>Monthly</span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={isAnnual}
                  onChange={(e) => setIsAnnual(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
              <span className={isAnnual ? styles.active : ""}>Annual <span className={styles.badge}>Save 20%</span></span>
            </div>
          </header>

          <div className={styles.grid}>
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`${styles.card} ${plan.popular ? styles.popular : ""}`}
              >
                {plan.popular && <div className={styles.badge}>Most Popular</div>}
                <h3>{plan.title}</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>
                    {isAnnual ? Math.floor(plan.price * 0.8) : plan.price}
                  </span>
                  <span className={styles.period}>/month</span>
                </div>
                <ul className={styles.features}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
                <button className={styles.ctaBtn}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}