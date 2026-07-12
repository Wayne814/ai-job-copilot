import { useState } from "react";
import styles from "./ResumeForm.module.css";

export default function ResumeForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    jobTitle: "",
    experience: "",
    education: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting resume data:", formData);
    alert("Resume generation started!");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Create Your Resume</h2>
      
      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange} 
            placeholder="John Doe" 
            required 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="john@example.com" 
            required 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label>Target Job Title</label>
          <input 
            name="jobTitle" 
            value={formData.jobTitle} 
            onChange={handleChange} 
            placeholder="Software Engineer" 
            required 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label>Work Experience</label>
          <textarea 
            name="experience" 
            value={formData.experience} 
            onChange={handleChange} 
            placeholder="Describe your roles..." 
            rows="4"
            required 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label>Education</label>
          <textarea 
            name="education" 
            value={formData.education} 
            onChange={handleChange} 
            placeholder="University, Degree, Year..." 
            rows="2"
            required 
          />
        </div>
      </div>

      <button type="submit" className={styles.submitBtn}>
        Generate Resume with AI
      </button>
    </form>
  );
}