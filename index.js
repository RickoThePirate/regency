const express = require("express");
const axios = require("axios");
const app = express();

const CLIENT_ID = "DIN_CLIENT_ID";
const CLIENT_SECRET = "DIN_CLIENT_SECRET";
const REDIRECT_URI = "DIN_RAILWAY_URL/callback";

app.get("/", (req, res) => {
  res.send('<a href="/login">Login med Discord</a>');
});

app.get("/login", (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=identify guilds`;
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  const token = await axios.post("https://discord.com/api/oauth2/token",
    new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const user = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token.data.access_token}`
    }
  });

  res.send(`Du er logget ind som: ${user.data.username}`);
});

app.listen(3000, () => console.log("Server kører"));
