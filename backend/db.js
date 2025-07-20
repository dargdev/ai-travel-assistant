// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
        name TEXT,
        email TEXT PRIMARY KEY,
        role TEXT,
        password TEXT,
        itinerary TEXT
    )
    `);

  const insert = db.prepare(
    'INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?, ?)',
  );
  insert.run(
    'David Ruano',
    'david.ruano@algoworks.com',
    'traveler',
    'david123',
    JSON.stringify([]),
  );
  insert.run(
    'Andres Yajamin',
    'andres.yajamin@algoworks.com',
    'traveler',
    'andres123',
    JSON.stringify([]),
  );
  insert.run(
    'Nisha Gharpure',
    'nisha.gharpure@algoworks.com',
    'manager',
    'nisha123',
    JSON.stringify([]),
  );
  insert.run(
    'Adam Carter',
    'adam.carter@algoworks.com',
    'manager',
    'adam123',
    JSON.stringify([]),
  );
  insert.finalize();
});

module.exports = db;
