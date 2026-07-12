export default function Professional({ resume }) {
  return (
    <div>

      <div
        style={{
          background:"#1e3a8a",
          color:"white",
          padding:"25px"
        }}
      >

        <h1>{resume.name}</h1>

        <p>{resume.email}</p>

      </div>

      <div style={{padding:"20px"}}>

        <h2>Education</h2>

        <p>{resume.education}</p>

        <h2>Experience</h2>

        <p>{resume.experience}</p>

        <h2>Skills</h2>

        <p>{resume.skills}</p>

      </div>

    </div>
  );
}