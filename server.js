const express = require("express");
const path = require("path");
const axios = require("axios"); // To make HTTP requests to the TV API

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/user_games/:userId", async (req, res) => {
  const userId = req.params.userId;
  const url = `https://games.roblox.com/v2/users/${userId}/games`; // Replace with your TV's API URL
  console.log(url);

  try {
    const response = await axios.post(tvApiUrl);
    let gameIds = [];
    for (game in response.data) {
      gameIds.push(game.id);
    }
    res.json({ success: true, response: gameIds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/game_passes/:universeId", async (req, res) => {
  const universeId = req.params.universeId;
  const url = `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100&sortOrder=Asc`; // Replace with your TV's API URL
  console.log(url);
  let workingDev = [];
  try {
    const response = await axios.get(url);
    for (let i = 0; i < response.data.data.length; i++) {
      if (response.data.data[i].productId) {
        workingDev.push(response.data.data[i].id);
      }
    }
    console.log(workingDev);
    res.json({ success: true, response: workingDev });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/universe_id/:userId", async (req, res) => {
  const userId = req.params.userId;
  const url = `https://www.roblox.com/users/profile/playergames-json?userId=${userId}`; // Replace with your TV's API URL
  console.log(url);
  let universeIds = [];
  try {
    const response = await axios.get(url);
    for (i = 0; i < response.data.Games.length; i++) {
      if (response.data.Games[i].UniverseID) {
        universeIds.push(response.data.Games[i].UniverseID);
      }
    }
    res.json({ success: true, response: universeIds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/pass_price/:userId/:passId", async (req, res) => {
  const userId = req.params.userId;
  const url = `https://www.roblox.com/users/profile/playergames-json?userId=${userId}`; // Replace with your TV's API URL
  console.log(url);
  let universeIds = [];
  try {
    const response = await axios.get(url);
    for (i = 0; i < response.data.Games.length; i++) {
      if (response.data.Games[i].UniverseID) {
        universeIds.push(response.data.Games[i].UniverseID);
      }
    }
  } catch (error) {
    console.log({ success: false, error: error.message });
  }

  for (let i = 0; i < universeIds.length; i++) {
    const passId = req.params.passId;
    const passUrl = `https://games.roblox.com/v1/games/${universeIds[i]}/game-passes?limit=100&sortOrder=Asc`;
    try {
      const passResponse = await axios.get(passUrl);
      for (let j = 0; j < passResponse.data.data.length; j++) {
        if (passResponse.data.data[j].id == passId) {
          res.json({
            success: true,
            response: passResponse.data.data[j].price,
          });
          console.log(passResponse.data.data[j].price);
          return;
        }
      }
    } catch (passError) {
      console.log({ success: false, error: passError.message });
    }
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
