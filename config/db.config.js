const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("administrator_kimikobz", "administrator_kimikobz", "oOwg2o@4o9_6", {
  dialect: "mysql",
  host: "103.120.176.66",
  logging:false
});
module.exports = sequelize;
