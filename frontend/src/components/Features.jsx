import styles from "./Features.module.css";

const features = [
  { title: "AI Resume Generator", desc: "Generate ATS-friendly resumes instantly." },
  { title: "Cover Letter Generator", desc: "Tailored cover letters for every job." },
  { title: "Portfolio Generator", desc: "Showcase your work with stunning designs." },
  { title: "PDF Export", desc: "Download professional PDFs in one click." },
  { title: "ATS Checker", desc: "Ensure your resume passes automated scans." },
  { title: "LinkedIn Optimization", desc: "Optimize your profile for recruiters." },
];

export default function Features() {
  return (
    <section className={styles.section}>
      <h2>Features</h2>
      <div className={styles.grid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.icon}>✨</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}