const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// Connect to database
connectDB();

const app = express();

//allow api calls from our vite frontend
app.use(cors({
  origin: 'https://ai-job-copilot-omega.vercel.app/',
  credentials: true
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const BASE_PORT = parseInt(process.env.PORT, 10) || 8000;
const MAX_PORT_TRIES = 5;

function listenWithFallback(port, remainingTries) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && remainingTries > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} already in use; trying port ${nextPort}.`);
      listenWithFallback(nextPort, remainingTries - 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}

listenWithFallback(BASE_PORT, MAX_PORT_TRIES);