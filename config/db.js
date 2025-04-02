const { Client } = require("pg");

const connection = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "blogapp",
});

connection
  .connect()
  .then(() => console.log("Connected to PostgreSQL successfully!"))
  .catch((err) => console.error("Connection error", err.stack));

module.exports = connection;
