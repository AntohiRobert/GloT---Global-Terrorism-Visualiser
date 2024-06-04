const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// cale
const dbPath = path.resolve(__dirname, '../../data/incidents.db');

// conexiune
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Database connected.');
  }
});

db.serialize(() => {
  //select all
  db.all("SELECT * FROM incidents", (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(rows);
    }
  });
});

db.close();
