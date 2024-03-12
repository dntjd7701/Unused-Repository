const mysql = require("mysql2");

module.exports = function () {
  return mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "webdb",
    password: "webdb",
    database: "webdb",
  });
};
