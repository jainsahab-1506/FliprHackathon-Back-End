const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
mongoose.connect(
  "mongodb+srv://admin-naman:" +
    process.env.CLUSTER_PASSWORD +
    "@cluster0.3djy5.mongodb.net/FliperDB?retryWrites=true&w=majority",
  { useNewUrlParser: true }
  //   () => {
  //     console.log("Database connected.");
  //   }
);

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.send("Hello");
});
app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Running");
});
