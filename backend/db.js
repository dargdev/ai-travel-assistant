const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      name TEXT,
      email TEXT PRIMARY KEY,
      role TEXT,
      password TEXT,
      itinerary TEXT,
      status TEXT DEFAULT 'pending'
    )
  `);

  const insert = db.prepare(
    'INSERT OR IGNORE INTO users (name, email, role, password, itinerary, status) VALUES (?, ?, ?, ?, ?, ?)',
  );

  insert.run(
    'David Ruano',
    'david.ruano@algoworks.com',
    'traveler',
    'david123',
    '',
    'pending',
  );
  insert.run(
    'Andres Yajamin',
    'andres.yajamin@algoworks.com',
    'traveler',
    'andres123',
    '',
    'pending',
  );
  insert.run(
    'Nisha Gharpure',
    'nisha.gharpure@algoworks.com',
    'manager',
    'nisha123',
    '',
    'pending',
  );
  insert.run(
    'Adam Carter',
    'adam.carter@algoworks.com',
    'manager',
    'adam123',
    '',
    'pending',
  );
  insert.run(
    'John Smith',
    'john.smith@algoworks.com',
    'traveler',
    'john123',
    '',
    'pending',
  );
  insert.run(
    'Emily Johnson',
    'emily.johnson@algoworks.com',
    'traveler',
    'emily123',
    '',
    'pending',
  );

  insert.finalize();
});

module.exports = db;
