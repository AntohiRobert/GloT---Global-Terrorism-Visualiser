const db = require('../utils/db');

const getAll = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT eventid as id, iyear, imonth, iday, country_txt as country, region_txt as region, city, latitude, longitude, weaptype1_txt as weaponType, nkill as fatalities FROM global_terrorism LIMIT 1000;',
     (err, rows) => {
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
    db.get('SELECT * FROM global_terrorism WHERE eventid = ?', [id], (err, row) => {
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