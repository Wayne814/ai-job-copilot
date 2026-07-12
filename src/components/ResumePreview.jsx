import styles from "./ResumePreview.module.css";
import Modern from "./templates/Modern";
import Professional from "./templates/Professional";

export default function ResumePreview({
    resume,
    template
}) {

    if(!resume) return null;

    switch(template){

        case "professional":
            return <Professional resume={resume}/>;

        default:
            return <Modern resume={resume}/>;
    }


  {resume && (

<div className={styles.actions}>

<button
onClick={downloadPDF}
className={styles.downloadBtn}
>

📄 Download PDF

</button>

</div>

)}

  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <h2>Resume Preview</h2>
      </div>

      <pre className={styles.content}>
        {resume}
      </pre>
    </div>
  );
}
