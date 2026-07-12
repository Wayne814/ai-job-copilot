require('dotenv').config({ path: './.env' });
const { generateResume } = require('./services/aiService');

(async () => {
  try {
    const result = await generateResume({
      name: 'John Doe',
      jobTitle: 'Software Engineer',
      skills: 'JavaScript, React, Node.js',
      experience: 'Senior Developer at Acme (Jan 2020 - Present) — Led migration',
      education: "Bachelor's — MIT (2020)",
      projects: 'Resume Builder App',
      certifications: 'AWS Certified Developer'
    });
    console.log('SUCCESS');
    console.log(result);
  } catch (err) {
    console.error('ERROR:', err.message || err);
    if (err.response) {
      console.error('RESPONSE:', err.response.data || err.response.statusText || err.response);
    }
    process.exit(1);
  }
})();
