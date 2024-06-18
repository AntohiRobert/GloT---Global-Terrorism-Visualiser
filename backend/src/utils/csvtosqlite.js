const fs = require('fs');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const csvFilePath = path.resolve(__dirname, '../../data/terrordb.csv');

const dbPath = path.resolve(__dirname, '../../data/incidents.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

const createTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS global_terrorism (
      eventid TEXT, iyear TEXT, imonth TEXT, iday TEXT,
      approxdate TEXT, extended TEXT, resolution TEXT,
      country TEXT, country_txt TEXT, region TEXT,
      region_txt TEXT, provstate TEXT, city TEXT,
      latitude TEXT, longitude TEXT, specificity TEXT,
      vicinity TEXT, location TEXT, summary TEXT,
      crit1 TEXT, crit2 TEXT, crit3 TEXT, doubtterr TEXT,
      alternative TEXT, alternative_txt TEXT, multiple TEXT,
      success TEXT, suicide TEXT, attacktype1 TEXT,
      attacktype1_txt TEXT, attacktype2 TEXT, attacktype2_txt TEXT,
      attacktype3 TEXT, attacktype3_txt TEXT, targtype1 TEXT,
      targtype1_txt TEXT, targsubtype1 TEXT, targsubtype1_txt TEXT,
      corp1 TEXT, target1 TEXT, natlty1 TEXT, natlty1_txt TEXT,
      targtype2 TEXT, targtype2_txt TEXT, targsubtype2 TEXT,
      targsubtype2_txt TEXT, corp2 TEXT, target2 TEXT,
      natlty2 TEXT, natlty2_txt TEXT, targtype3 TEXT,
      targtype3_txt TEXT, targsubtype3 TEXT, targsubtype3_txt TEXT,
      corp3 TEXT, target3 TEXT, natlty3 TEXT, natlty3_txt TEXT,
      gname TEXT, gsubname TEXT, gname2 TEXT, gsubname2 TEXT,
      gname3 TEXT, gsubname3 TEXT, motive TEXT, guncertain1 TEXT,
      guncertain2 TEXT, guncertain3 TEXT, individual TEXT,
      nperps TEXT, nperpcap TEXT, claimed TEXT, claimmode TEXT,
      claimmode_txt TEXT, claim2 TEXT, claimmode2 TEXT,
      claimmode2_txt TEXT, claim3 TEXT, claimmode3 TEXT,
      claimmode3_txt TEXT, compclaim TEXT, weaptype1 TEXT,
      weaptype1_txt TEXT, weapsubtype1 TEXT, weapsubtype1_txt TEXT,
      weaptype2 TEXT, weaptype2_txt TEXT, weapsubtype2 TEXT,
      weapsubtype2_txt TEXT, weaptype3 TEXT, weaptype3_txt TEXT,
      weapsubtype3 TEXT, weapsubtype3_txt TEXT, weaptype4 TEXT,
      weaptype4_txt TEXT, weapsubtype4 TEXT, weapsubtype4_txt TEXT,
      weapdetail TEXT, nkill TEXT, nkillus TEXT, nkillter TEXT,
      nwound TEXT, nwoundus TEXT, nwoundte TEXT, property TEXT,
      propextent TEXT, propextent_txt TEXT, propvalue TEXT,
      propcomment TEXT, ishostkid TEXT, nhostkid TEXT, nhostkidus TEXT,
      nhours TEXT, ndays TEXT, divert TEXT, kidhijcountry TEXT,
      ransom TEXT, ransomamt TEXT, ransomamtus TEXT, ransompaid TEXT,
      ransompaidus TEXT, ransomnote TEXT, hostkidoutcome TEXT,
      hostkidoutcome_txt TEXT, nreleased TEXT, addnotes TEXT,
      scite1 TEXT, scite2 TEXT, scite3 TEXT, dbsource TEXT,
      INT_LOG TEXT, INT_IDEO TEXT, INT_MISC TEXT, INT_ANY TEXT,
      related TEXT
    );
  `;
  db.run(query, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Table created or already exists.');
  });
};

const insertData = (data) => {
  const placeholders = Object.keys(data).map(() => '?').join(',');
  const sql = `INSERT INTO global_terrorism (${Object.keys(data).join(',')}) VALUES (${placeholders})`;
  db.run(sql, Object.values(data), (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
};

const importCsvData = () => {
  createTable();
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => insertData(row))
    .on('end', () => {
      console.log('CSV file has been processed.');
      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Closed the database connection.');
      });
    });
};

importCsvData();
