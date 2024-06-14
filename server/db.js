const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/discord', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    snowflake: String,
    username: String,
    discriminator: String,
    avatar: String,

    // User auth
    auth: {
        username: String,
        password: String,
        salt: String,
        email: String,
    } 
});

const guildSchema = new mongoose.Schema({
    snowflake: String,
    name: String,
    icon: String,
    owner: String,
    members: Array
});

const channelSchema = new mongoose.Schema({
    snowflake: String,
    name: String,
    type: String,
    guild: String,

    // Channel permissions
    permissions: Array,
});

const messageSchema = new mongoose.Schema({
    snowflake: String,
    content: String,
    attachments: Array,

    // User
    author: String,
    channel: String,
});

const roleSchema = new mongoose.Schema({
    snowflake: String,
    name: String,
    color: String,
    permissions: Number,
    guild: String,
});

const User = mongoose.model('User', userSchema);
const Guild = mongoose.model('Guild', guildSchema);
const Channel = mongoose.model('Channel', channelSchema);
const Message = mongoose.model('Message', messageSchema);
const Role = mongoose.model('Role', roleSchema);

module.exports = {
    User,
    Guild,
    Channel,
    Message,
    Role,
};

