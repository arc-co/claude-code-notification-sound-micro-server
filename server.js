const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

if (!BEARER_TOKEN) {
  console.error('ERROR: BEARER_TOKEN environment variable is required');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store connected SSE clients
let clients = [];

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token || token !== BEARER_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

// SSE endpoint for frontend clients
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial connection message
  res.write('data: {"type":"connected"}\n\n');

  // Add this client to the list
  clients.push(res);

  // Remove client when connection closes
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// Notification endpoint (requires authentication)
app.post('/notify', authenticateToken, (req, res) => {
  console.log('Notification received, broadcasting to', clients.length, 'client(s)');

  // Broadcast to all connected clients
  clients.forEach(client => {
    client.write('data: {"type":"notify"}\n\n');
  });

  res.json({ success: true, message: 'Notification sent' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', clients: clients.length });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Bearer token configured: ${BEARER_TOKEN.substring(0, 4)}...`);
});
