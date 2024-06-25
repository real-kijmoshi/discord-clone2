const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../utils/auth");
const { User, Guild, Channel, Role, Message } = require("../db");
const email = require("../routers/email");
const snowflake = require("../utils/snowflake");
const Permissions = require("../utils/permissions");
const creator = require("../utils/creator");
const { eventEmitter } = require("../utils/socketServer");
const trustedEmails = require("../utils/trustedEmails.json");
require("dotenv").config();

const router = express.Router();

// Middleware for token verification
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

// Middleware for authentication
const authProtected = (req, res, next) => {
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

  const user = await User.findOne({ username });

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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
router.post("/register", async (req, res) => {
  const { username, password, email: userEmail } = req.body;
  if (!username || !password || !userEmail) {
    return res.status(400).json({ message: "Missing fields", ok: false });
  }

  if(!trustedEmails.some(email => userEmail.endsWith(email))) {
    return res.status(400).json({ message: "Invalid email domain", ok: false });
  }
  
  if (!EMAIL_REGEX.test(userEmail)) {
    return res.status(400).json({ message: "Invalid email", ok: false });
  }

  const user = await User.findOne({
    $or: [{ username }, { email: userEmail }],
  });

  if (user?.auth.email === userEmail) {
    return res.status(400).json({ message: "Email already in use", ok: false });
  } else if (user) {
    return res.status(400).json({ message: "Username already in use", ok: false });
  }

  const registered = await auth.register(username, password, userEmail);
  if (!registered) {
    return res.status(500).json({ message: "Failed to register", ok: false });
  }

  email.verify(userEmail);
  creator.createGuild(registered, username);

  res.json({ message: "Registered", ok: true });
});

router.get("/whoami", authProtected, async (req, res) => {
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

router.get("/guilds", authProtected, async (req, res) => {
  const { snowflake } = req.user;

  const guilds = await Guild.find({
    members: { $in: [snowflake] }
  });

  res.json(guilds);
});

router.get("/guilds/:id", authProtected, async (req, res) => {
  const { id } = req.params;
  const { snowflake } = req.user;

  const guild = await Guild.findOne({
    snowflake: id,
    members: { $in: [snowflake] }
  });

  if (!guild) {
    return res.status(404).json({ message: "Guild not found", ok: false });
  }

  const channels = await Channel.find({ guild: id });

  const userRoles = await Role.find({ guild: id, users: { $in: [snowflake] } });

  const userPermissions = userRoles.reduce((acc, role) => {
    acc |= role.permissions;
    return acc;
  }, 0);

  const allowedChannels = channels.filter(channel => {
    if (guild.owner === snowflake || !channel.permissions) {
      return true;
    }
    return Permissions.hasPermission(userPermissions, Permissions.PERMISSIONS.CHANNEL.VIEW_CHANNEL);
  });

  const guildInfo = {
    ...guild.toJSON(),
    channels: allowedChannels,
  };

  res.json(guildInfo);
});

router.get("/channels/:id/messages", authProtected, async (req, res) => {
  const { id } = req.params;
  const newestSnowflake = req.query.newestSnowflake || null;
  const limit = parseInt(req.query.limit, 10) || 50;

  const channel = await Channel.findOne({ snowflake: id });
  if (!channel) {
    return res.status(404).json({ message: "Channel not found", ok: false });
  }

  const messages = await Message.find({
    channel: id,
    ...(newestSnowflake ? { snowflake: { $lt: newestSnowflake } } : {}),
  })
  .sort({ snowflake: -1 })
  .limit(limit);

  res.json(messages);
});

router.post("/channels/:id/messages", authProtected, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const channel = await Channel.findOne({ snowflake: id });
  if (!channel) {
    return res.status(404).json({ message: "Channel not found", ok: false });
  }

  if (!content) {
    return res.status(400).json({ message: "Missing content", ok: false });
  }

  const message = {
    snowflake: snowflake.nextId("message").toString(),
    content,
    author: req.user.snowflake,
    channel: id,
  };

  await Message.create(message);

  eventEmitter.emit("message", message);
  res.json(message);
});

router.get("/users/:id", authProtected, async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ snowflake: id });

  if (!user) {
    return res.status(404).json({ message: "User not found", ok: false });
  }

  res.json({
    ...user.toJSON(),
    auth: null,
  });
});

module.exports = router;
