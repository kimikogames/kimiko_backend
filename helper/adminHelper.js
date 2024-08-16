"user strict";
var sql = require("../config/db.config");
// const path = require("path");

module.exports = {
  getAlredyPlacedBet: function (params) {
    let query_string =
      "SELECT number FROM colour_bet WHERE gamesno = ? AND userid = ? AND gameid = ? AND status = 0;";
    let param = params;
    return new Promise((resolve, reject) => {
      sql.query(query_string, param, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },
  randomStr: function (len, arr) {
    let ans = "";
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  },
  queryDb: function (query, param) {
    return new Promise((resolve, reject) => {
      sql.query(query, param, (err, result) => {
        if (err) {
          //return reject(err);
          return console.log(err);
        }
        resolve(result);
      });
    });
  },
};
