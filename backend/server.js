// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row)
        return res.status(401).json({ error: 'Invalid email or password' });

      row.itinerary = JSON.parse(row.itinerary || '[]');
      res.json({ name: row.name, email: row.email, role: row.role });
    },
  );
});

// Get user by email
app.get('/users/:email', (req, res) => {
  const email = req.params.email;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    row.itinerary = JSON.parse(row.itinerary || '[]');
    res.json(row);
  });
});

// Update itinerary
app.put('/users/:email/itinerary', (req, res) => {
  const email = req.params.email;
  const itinerary = JSON.stringify(req.body.itinerary || []);
  db.run(
    'UPDATE users SET itinerary = ? WHERE email = ?',
    [itinerary, email],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    },
  );
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Backend running at http://localhost:${PORT}`),
);
