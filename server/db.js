const mongoose = require("mongoose");
require("dotenv").config();

// Set strictQuery to false to prepare for the change in Mongoose 7
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/discord", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("-------------------");
    console.log("Connected to MongoDB");
    console.log(
      "Database url: " + process.env.MONGO_URI ||
        "mongodb://localhost:27017/discord"
    );
    console.log("-------------------");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  snowflake: String,
  username: String,
  discriminator: String,
  avatar: String,
  emailVerified: Boolean,
  auth: {
    username: String,
    password: String,
    salt: String,
    email: String,
  },
});

const guildSchema = new mongoose.Schema({
  snowflake: String,
  name: String,
  icon: String,
  owner: String,
  members: Array,
});

const channelSchema = new mongoose.Schema({
  snowflake: String,
  name: String,
  channelType: String,
  guild: String,

  // Channel permissions
  permissions: Array,
});

const messageSchema = new mongoose.Schema({
  snowflake: String,
  content: String,
  attachments: Array,

  // User
  author: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return typeof v === "string";
      },
      message: (props) => `${props.value} is not a valid string!`,
    },
  },
  channel: String,
});

const roleSchema = new mongoose.Schema({
  snowflake: String,
  name: String,
  color: String,
  permissions: Number,
  guild: String,
});

const User = mongoose.model("User", userSchema);
const Guild = mongoose.model("Guild", guildSchema);
const Channel = mongoose.model("Channel", channelSchema);
const Message = mongoose.model("Message", messageSchema);
const Role = mongoose.model("Role", roleSchema);

module.exports = {
  User,
  Guild,
  Channel,
  Message,
  Role,
};
