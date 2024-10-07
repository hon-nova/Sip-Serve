const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { EOL } = require("os");
const fs = require("node:fs/promises");
const csvFile = path.join(__dirname, "menu.csv");
const txtFile = path.join(__dirname, "menu.txt");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, ()=>{
   console.log(`Lab04AdvancedFullStack is running on: http://localhost:${PORT}`)
})