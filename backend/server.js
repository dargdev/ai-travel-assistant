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

// Update itinerary
app.put('/users/:email/itinerary', (req, res) => {
  const email = req.params.email;
  const itinerary = JSON.stringify(req.body || []);
  db.run(
    'UPDATE users SET itinerary = ? WHERE email = ?',
    [itinerary, email],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true });
    },
  );
});

app.get('/users', (req, res) => {
  db.all(
    'SELECT name, email, role, itinerary, status FROM users WHERE role = "traveler"',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

app.put('/users/:email/approve', (req, res) => {
  const email = req.params.email;
  db.run(
    'UPDATE users SET status = "approved" WHERE email = ?',
    [email],
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
