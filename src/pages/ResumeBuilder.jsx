import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import TemplateSelector from "../components/TemplateSelector";
import ResumePreview from "../components/ResumePreview";

import styles from "./ResumeBuilder.module.css";

export default function ResumeBuilder() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        education: [
            {
                level: "",
                
                institution: "",
                year: ""
            }
        ],
        experience: [
            {
                title: "",
                company: "",
                startDate: "",
                endDate: "",
                description: ""
            }
        ],
        skills: "",
        projects: "",
        certifications: ""
    });

    const [resume, setResume] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [template,setTemplate] = useState("modern");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleEducationChange = (e, index) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newEducation = [...prev.education];
            newEducation[index] = {
                ...newEducation[index],
                [name]: value
            };
            return { ...prev, education: newEducation };
        });
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [
                ...prev.education,
                { level: "", institution: "", year: "" }
            ]
        }));
    };

    const removeEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handleExperienceChange = (e, index) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newExperience = [...prev.experience];
            newExperience[index] = {
                ...newExperience[index],
                [name]: value
            };
            return { ...prev, experience: newExperience };
        });
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { title: "", company: "", startDate: "", endDate: "", description: "" }
            ]
        }));
    };

    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        const hasEducation = formData.education.some(edu => edu.level && edu.level.trim());
        if (!hasEducation) {
            newErrors.education = "Please add at least one education entry with a degree level.";
        }

        const hasExperience = formData.experience.some(exp => (exp.title && exp.title.trim()) || (exp.company && exp.company.trim()));
        if (!hasExperience) {
            newErrors.experience = "Please add at least one job title or company.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatPreview = () => {
        return `
╔════════════════════════════════════════╗
║        RESUME PREVIEW                  ║
╚════════════════════════════════════════╝

${formData.name.toUpperCase()}
${formData.email}${formData.phone ? ' | ' + formData.phone : ''}

──────────────────────────────────────────
EDUCATION
──────────────────────────────────────────
${formData.education
    .filter(edu => edu.level || edu.institution)
    .map(edu => `${edu.level}${edu.institution ? ' – ' + edu.institution : ''}${edu.year ? ' (' + edu.year + ')' : ''}`)
    .join('\n') || '(No education added yet)'}

──────────────────────────────────────────
EXPERIENCE
──────────────────────────────────────────
${formData.experience
    .filter(exp => exp.title || exp.company)
    .map(exp => {
        let line = '';
        if (exp.title) line += exp.title;
        if (exp.company) line += (exp.title ? ' at ' : '') + exp.company;
        if (exp.startDate || exp.endDate) {
            line += ' (' + (exp.startDate || '?') + ' – ' + (exp.endDate || 'Present') + ')';
        }
        if (exp.description) line += '\n  ' + exp.description;
        return line;
    })
    .join('\n\n') || '(No experience added yet)'}

──────────────────────────────────────────
SKILLS
──────────────────────────────────────────
${formData.skills.trim() || '(No skills added yet)'}

──────────────────────────────────────────
PROJECTS
──────────────────────────────────────────
${formData.projects.trim() || '(No projects added yet)'}

──────────────────────────────────────────
CERTIFICATIONS
──────────────────────────────────────────
${formData.certifications.trim() || '(No certifications added yet)'}
        `.trim();
    };

    const generateResume = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const payload = {
                ...formData,
                // Serialize education array into human-friendly strings
                education: formData.education
                    .filter(edu => edu.level || edu.institution)
                    .map(edu => `${edu.level}${edu.institution ? ' — ' + edu.institution : ''}${edu.year ? ' (' + edu.year + ')' : ''}`)
                    .join('; '),
                experience: formData.experience
                    .filter(exp => exp.title || exp.company)
                    .map(exp => {
                        let line = `${exp.title}${exp.company ? ' at ' + exp.company : ''}`;
                        if (exp.startDate || exp.endDate) {
                            line += ` (${exp.startDate || '?'} - ${exp.endDate || 'Present'})`;
                        }
                        if (exp.description) {
                            line += ` — ${exp.description}`;
                        }
                        return line;
                    })
                    .join('; ')
            };

            const response = await axios.post(
                "http://localhost:8000/api/documents/resume",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setResume(response.data.document.content);

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Resume generation failed."
            );

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
// Download Resume as PDF
// ==========================================
const downloadPDF = () => {

    if (!resume) {
        alert("Generate a resume first.");
        return;
    }

    const pdf = new jsPDF();

    pdf.setFont("times", "normal");

    pdf.setFontSize(12);

    const lines = pdf.splitTextToSize(resume, 180);

    pdf.text(lines, 15, 20);

    pdf.save("AI_Resume.pdf");

};

    return (

        <>
            <Navbar />

            <div className={styles.container}>

                <h1>AI Resume Builder</h1>

                {Object.keys(errors).length > 0 && (
                    <div className={styles.errorBox}>
                        {Object.entries(errors).map(([key, msg]) => (
                            <p key={key} className={styles.errorMsg}>
                                ⚠️ {msg}
                            </p>
                        ))}
                    </div>
                )}

                <form
                    className={styles.form}
                    onSubmit={generateResume}
                >

                    <input
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <div className={styles.educationSection}>
                        <h3>Education</h3>
                        {formData.education.map((edu, index) => (
                            <div key={index} className={styles.educationGroup}>
                                <label>
                                    Degree Level
                                    <select
                                        name="level"
                                        value={edu.level}
                                        onChange={(e) => handleEducationChange(e, index)}
                                        required
                                    >
                                        <option value="">Select degree</option>
                                        <option value="High School">High School</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Bachelor's">Bachelor's</option>
                                        <option value="Master's">Master's</option>
                                        <option value="PhD">PhD</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </label>

                                <input
                                    name="institution"
                                    placeholder="Institution"
                                    value={edu.institution}
                                    onChange={(e) => handleEducationChange(e, index)}
                                />

                                <input
                                    name="year"
                                    type="number"
                                    placeholder="Graduation Year"
                                    value={edu.year}
                                    onChange={(e) => handleEducationChange(e, index)}
                                />

                                {formData.education.length > 1 && (
                                    <button
                                        type="button"
                                        className={styles.removeBtn}
                                        onClick={() => removeEducation(index)}
                                    >
                                        ✕ Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            className={styles.addBtn}
                            onClick={addEducation}
                        >
                            + Add Education
                        </button>
                    </div>

                    <div className={styles.experienceSection}>
                        <h3>Experience</h3>
                        {formData.experience.map((exp, index) => (
                            <div key={index} className={styles.experienceGroup}>
                                <div className={styles.experienceRow}>
                                    <input
                                        name="title"
                                        placeholder="Job Title"
                                        value={exp.title}
                                        onChange={(e) => handleExperienceChange(e, index)}
                                    />

                                    <input
                                        name="company"
                                        placeholder="Company"
                                        value={exp.company}
                                        onChange={(e) => handleExperienceChange(e, index)}
                                    />
                                </div>

                                <div className={styles.experienceRow}>
                                    <input
                                        name="startDate"
                                        type="text"
                                        placeholder="Start Date (e.g., Jan 2020)"
                                        value={exp.startDate}
                                        onChange={(e) => handleExperienceChange(e, index)}
                                    />

                                    <input
                                        name="endDate"
                                        type="text"
                                        placeholder="End Date (e.g., Dec 2023)"
                                        value={exp.endDate}
                                        onChange={(e) => handleExperienceChange(e, index)}
                                    />
                                </div>

                                <textarea
                                    name="description"
                                    placeholder="Job Description & Achievements"
                                    value={exp.description}
                                    onChange={(e) => handleExperienceChange(e, index)}
                                    rows="4"
                                />

                                {formData.experience.length > 1 && (
                                    <button
                                        type="button"
                                        className={styles.removeBtn}
                                        onClick={() => removeExperience(index)}
                                    >
                                        ✕ Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            className={styles.addBtn}
                            onClick={addExperience}
                        >
                            + Add Experience
                        </button>
                    </div>

                    <textarea
                        name="skills"
                        placeholder="Skills"
                        value={formData.skills}
                        onChange={handleChange}
                    />

                    <textarea
                        name="projects"
                        placeholder="Projects"
                        value={formData.projects}
                        onChange={handleChange}
                    />

                    <textarea
                        name="certifications"
                        placeholder="Certifications"
                        value={formData.certifications}
                        onChange={handleChange}
                    />

                    <button
                      type="submit"
                      className={styles.generateBtn}
                      disabled={loading}
                             >
                       {loading ? "Generating Resume..." : " Generate Resume"}
                    </button>

                </form>

                {resume && (
                    <div style={{ marginTop: 12 }}>
                        <button
                            className={styles.generateBtn}
                            onClick={downloadPDF}
                        >
                            ⬇️ Download PDF
                        </button>
                    </div>
                )}

                <div className={styles.previewSection}>
                    <h2>📋 Live Preview</h2>
                    <textarea
                        readOnly
                        rows={20}
                        value={formatPreview()}
                        className={styles.previewTextarea}
                    />
                </div>

                {loading && (
                    <LoadingSpinner text="Generating Resume..." />
                )}

                {resume && (
                    <TemplateSelector
                    selected={template}
                    onSelect={setTemplate}
                     />
                )}

                {resume && (
                     <div className={styles.preview}>
                     <h2>Resume Preview</h2>

                     <ResumePreview
                     resume={formData}
                     template={template}
                     />
                     </div>
                 )}  

            </div>

            <Footer />
        </>

    );

}