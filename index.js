require("dotenv").config();

const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Hent fra .env (VIGTIGT!)
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Root (kun test)
app.get("/", (req, res) => {
  res.send("Backend kører ✅");
});

// Login route
app.get("/login", (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify`;
  res.redirect(url);
});

// Callback fra Discord
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.redirect(FRONTEND_URL);
  }

  try {
    // Hent token
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const access_token = tokenRes.data.access_token;

    // Hent bruger info
    const userRes = await axios.get(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    const user = userRes.data;

    // Send tilbage til din hjemmeside
    res.redirect(`${FRONTEND_URL}?username=${user.username}&avatar=${user.id}/${user.avatar}`);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.redirect(FRONTEND_URL);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server kører på port ${PORT}`);
});
