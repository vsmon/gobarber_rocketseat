require("dotenv").config();

const {
  db_dialect: dialect,
  db_host: host,
  db_port: port,
  db_username: username,
  db_password: password,
  db_database: database
} = process.env;

module.exports = {
  dialect,
  host,
  port,
  username,
  password,
  database,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
