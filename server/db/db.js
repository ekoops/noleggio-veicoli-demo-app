const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const DBSOURCE = process.env.DBSOURCE || path.join(__dirname, "./carrental.db");

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) throw err;
  else {
    const testQuery = "SELECT * FROM user";
    db.get(testQuery, [], (err) => {
      if (err) throw err;
    });
  }
});

module.exports = db;
