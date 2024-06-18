const crypto = require("crypto");

const { User } = require("../db");

const snowflake = require("./snowflake");

// Function to hash a password
function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
}

// Function to generate a salt
function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

// Function to authenticate a user
async function authenticate(username, password) {
  const user = await User.findOne({ username });
  if (!user) {
    return false;
  }

  return user.auth.password == hashPassword(password, user.auth.salt);
}

// Function to register a user
async function register(username, password, email) {
  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);
  const user = new User({
    snowflake: snowflake.nextId("user"),
    username,
    emailVerified: false,
    avatar: "default.png",
    auth: {
      password: hashedPassword,
      salt,
      email,
    },
  });
  await user.save();
  return user.toJSON().snowflake
}

module.exports = {
  authenticate,
  register,
};
