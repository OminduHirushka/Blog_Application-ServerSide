const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const postRoutes = require("./routes/PostRoutes");
const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
