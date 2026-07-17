import styles from "./TemplateSelector.module.css";
import { templates } from "./templates";

{
  templates.map((template) => (
    <div key={template.id}>
      <img src={template.image} alt={template.name} />

      <h3>{template.name}</h3>

      <button onClick={() => onSelect(template.id)}>
        Use Template
      </button>
    </div>
  ));
}

export default function TemplateSelector({ selected, onSelect }) {
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Modern blue professional layout",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Corporate clean resume",
    },
  ];

  return (
    <div className={styles.container}>
      <h2>Select Resume Template</h2>

      <div className={styles.grid}>
        {templates.map((template) => (
          <div
            key={template.id}
            className={`${styles.card} ${
              selected === template.id ? styles.active : ""
            }`}
          >
            <div className={styles.preview}>
              {template.name} Preview
            </div>

            <h3>{template.name}</h3>

            <p>{template.description}</p>

            <button onClick={() => onSelect(template.id)}>
              {selected === template.id
                ? "Selected"
                : "Use Template"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}