const { Client } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "blogapp",
});

connection.connect().then(() => console.log("Connected Successfully!"));

app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
});
