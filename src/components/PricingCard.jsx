import styles from "./PricingCard.module.css";

const PricingCard = ({ title, price, features, isPopular = false }) => {
  return (
    <div className={`${styles.card} ${isPopular ? styles.popular : ""}`}>
      {isPopular && <div className={styles.badge}>Most Popular</div>}
      <h3>{title}</h3>
      <div className={styles.price}>
        <span className={styles.currency}>$</span>
        <span className={styles.amount}>{price}</span>
      </div>
      <ul className={styles.list}>
        {features.map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>
      <button className={styles.button}>Get Started</button>
    </div>
  );
};

export default PricingCard;