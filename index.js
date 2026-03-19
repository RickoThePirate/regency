const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Regency backend virker 🔥");
});

app.listen(PORT, () => {
  console.log("Server kører på port " + PORT);
});
