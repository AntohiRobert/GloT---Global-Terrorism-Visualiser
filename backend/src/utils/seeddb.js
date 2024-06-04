const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// cale
const dbPath = path.resolve(__dirname, './data/incidents.db');

// conectare
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

  // erase current
  db.run('DELETE FROM incidents');

  // example data
  const stmt = db.prepare("INSERT INTO incidents (date, region, country, city, latitude, longitude, weaponType, fatalities) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  stmt.run('2023-05-14', 'North America', 'USA', 'New York', 40.7128, -74.0060, 'Firearms', 3);
  stmt.run('2023-05-15', 'Europe', 'France', 'Paris', 48.8566, 2.3522, 'Explosives', 5);
  stmt.run('2023-05-16', 'Asia', 'India', 'Mumbai', 19.0760, 72.8777, 'Blunt Weapons', 2);
  stmt.run('2023-05-17', 'Middle East', 'Iraq', 'Baghdad', 33.3152, 44.3661, 'Firearms', 10);
  stmt.run('2023-05-18', 'Africa', 'Nigeria', 'Lagos', 6.5244, 3.3792, 'Explosives', 7);
  stmt.finalize();
});

db.close();
