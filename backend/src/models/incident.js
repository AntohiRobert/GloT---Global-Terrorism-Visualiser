const db = require('../utils/db');

const getAll = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM incidents', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getById = (id) => {
  return new Promise((resolve, reject) => {
    console.log(id);
    db.get('SELECT * FROM incidents WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

module.exports = { getAll, getById };


//Sunt queries parametrizate, safe impotriva sql injection