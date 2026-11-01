const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DEMO_USER = { email: 'demo@streamflix.com', password: 'password123', name: 'Demo Viewer' };

app.use(express.json());

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    return res.json({ success: true, user: { email: DEMO_USER.email, name: DEMO_USER.name } });
  }
  return res.status(401).json({ success: false, message: 'Sorry, we can’t find an account with that email and password.' });
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`API server running at http://localhost:${PORT}`));
