export default function Modern({ resume }) {
  return (
    <div>

      <h1>{resume.name}</h1>

      <p>
        {resume.email} | {resume.phone}
      </p>

      <hr/>

      <h2>Education</h2>

      <p>{resume.education}</p>

      <h2>Experience</h2>

      <p>{resume.experience}</p>

      <h2>Skills</h2>

      <p>{resume.skills}</p>

    </div>
  );
}