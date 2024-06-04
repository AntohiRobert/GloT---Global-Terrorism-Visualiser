const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// cale
const dbPath = path.resolve(__dirname, '../../data/incidents.db');

// director
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Conectare la baza de date SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Database connected.');
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    region TEXT,
    country TEXT,
    city TEXT,
    latitude REAL,
    longitude REAL,
    weaponType TEXT,
    fatalities INTEGER
  )`);
});

module.exports = db;
