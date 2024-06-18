const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../utils/auth");
const { User, Guild } = require("../db");
const email = require("../routers/email");
const snowflake = require("../utils/snowflake");
require("dotenv").config();

const router = express.Router();


router.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token", ok: false });
    }
    req.user = decoded;
    next();
  });
});


// _____________________________
// Auth protected routes
// _____________________________

const authProteced = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized", ok: false });
  }
  next();
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields", ok: false });
  }

  const authenticated = await auth.authenticate(username, password);
  if (!authenticated) {
    return res.status(401).json({ message: "Invalid credentials", ok: false });
  }

  const user = await User.findOne({
    username,
  });

  const token = jwt.sign(
    {
      username: user.username,
      snowflake: user.snowflake,
      random: Math.floor(Math.random() * 1000),
    },
    process.env.JWT
  );

  res.json({ token });
});

router.post("/register", async (req, res) => {
  const { username, password, email: userEmail } = req.body;
  if (!username || !password || !userEmail) {
    return res.status(400).json({ message: "Missing fields", ok: false });
  }

  const user = await User.findOne({
    $or: [{ username }, { email: userEmail }],
  });

  if (user?.auth.email == userEmail) {
    return res.status(400).json({ message: "Email already in use", ok: false });
  } else if (user) {
    return res
      .status(400)
      .json({ message: "Username already in use", ok: false });
  }

  

  const registered = await auth.register(username, password, userEmail);
  if (!registered) {
    return res.status(500).json({ message: "Failed to register", ok: false });
  }

  email.verify(userEmail);


  const guildSnowflake = snowflake.nextId("guild");
  Guild.create({
    name: `${username}'s server`,
    snowflake: guildSnowflake,
    owner: registered,
    icon: "default.png",
    members: [registered],
    channels: [],
  });

  console.log(`Created guild with snowflake: ${guildSnowflake}`);  // Debugging log
  console.log(`Created guild with owner: ${registered}`);  // Debugging log
  console.log(`Created guild with members: ${[registered]}`);  // Debugging log



  res.json({ message: "Registered", ok: true });
});

router.get("/whoami", authProteced, async (req, res) => {
  const { snowflake } = req.user;
  
  const user = await User.findOne({ snowflake }); 
  if (!user) {
    return res.status(404).json({ message: "User not found", ok: false });
  }

  res.json({
    ...user.toJSON(),
    auth: null,
  });
});

router.get("/guilds", authProteced, async (req, res) => {
  const { snowflake } = req.user;
  
  console.log(`Looking up guilds for user with snowflake: ${snowflake}`);  // Debugging log
  
  const guilds = await Guild.find({ 
    members: { $in: [snowflake] }
  });

  console.log(`Found guilds: ${JSON.stringify(guilds)}`);  // Debugging log

  res.json(guilds);
}); 

module.exports = router;
