const mongoose = require("mongoose");
require("dotenv").config();

// Set strictQuery to false to prepare for the change in Mongoose 7
mongoose.set("strictQuery", false);

const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/discord";

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("-------------------");
    console.log("Connected to MongoDB");
    console.log(`Database url: ${dbURI}`);
    console.log("-------------------");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  snowflake: { type: String, required: true },
  username: { type: String, required: true },
  avatar: String,
  emailVerified: { type: Boolean, default: false },
  auth: {
    password: { type: String, required: true },
    salt: { type: String, required: true },
    email: { type: String, required: true },
  },
});

const guildSchema = new mongoose.Schema({
  snowflake: { type: String, required: true },
  name: { type: String, required: true },
  icon: String,
  owner: { type: String, required: true },
  members: { type: [String], default: [] },
});

const channelSchema = new mongoose.Schema({
  snowflake: { type: String, required: true },
  name: { type: String, required: true },
  channelType: { type: String, required: true },
  guild: { type: String, required: true },
  permissions: { type: [Number], default: [] }, // Channel permissions
});

const messageSchema = new mongoose.Schema({
  snowflake: { type: String, required: true },
  content: { type: String, required: true },
  attachments: { type: [String], default: [] },
  author: { 
    type: String, 
    required: true,
    ref: "User",
  },
  channel: { type: String, required: true },
});

const roleSchema = new mongoose.Schema({
  snowflake: { type: String, required: true },
  name: { type: String, required: true },
  color: String,
  permissions: { type: [Number], required: true }, // Changed to an array of numbers
  users: { type: [String], default: [] },
  guild: { type: String, required: true },
});

const realTimeUserSchema = new mongoose.Schema({
  snowflake: { type: String, required: true },
  onlineStatus: { type: Number, default: 0 }, // 0 = offline, 1 = online, 2 = idle, 3 = dnd
  activity: String,
  typing: { type: Boolean, default: false },
  typingIn: String,
  socket: String,
});

const User = mongoose.model("User", userSchema);
const Guild = mongoose.model("Guild", guildSchema);
const Channel = mongoose.model("Channel", channelSchema);
const Message = mongoose.model("Message", messageSchema);
const Role = mongoose.model("Role", roleSchema);
const RealTimeUser = mongoose.model("RealTimeUser", realTimeUserSchema);

module.exports = {
  User,
  Guild,
  Channel,
  Message,
  Role,
  RealTimeUser,
};
