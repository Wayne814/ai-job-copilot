const axios = require('axios');

(async () => {
  try {
    const res = await axios.post('http://localhost:8000/api/documents/resume-test', {
      name: 'John Doe',
      email: 'john@example.com',
      education: "Bachelor's — MIT (2020)",
      experience: 'Senior Dev at Acme (Jan 2020 - Present) — Led migration'
    }, { timeout: 5000 });

    console.log('STATUS', res.status);
    console.log('DATA', JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('HTTP ERROR', err.response.status, err.response.data);
    } else {
      console.error('ERROR', err.message);
    }
    process.exit(1);
  }
})();
