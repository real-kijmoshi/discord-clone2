const {
    Guild,
    Channel,
    User,
    Role
} = require('../db');

const Permissions = require('./permissions');
const snowflake = require('./snowflake');

const createGuild = async (owner) => {
    const guildID = snowflake.nextId("guild");
    const guild = new Guild({
        snowflake: guildID,
        owner,
        members: [owner]
    });

    await guild.save();

    const defaultChannel = new Channel({
        guild: guildID,
        name: "general",
        type: "text"
    });

    await defaultChannel.save();

    const everyoneRole = new Role({
        guild: guildID,
        name: "@everyone",
        permissions: [
            Permissions.PERMISSIONS.GUILD.VIEW_CHANNELS,
            Permissions.PERMISSIONS.GUILD.SEND_MESSAGES,
            Permissions.PERMISSIONS.GUILD.READ_MESSAGE_HISTORY,
            Permissions.PERMISSIONS.GUILD.JOIN_VOICE_CHANNELS,
            Permissions.PERMISSIONS.GUILD.SPEAK_IN_VOICE_CHANNELS
        ]
    });
    
    await everyoneRole.save();

    return guildID;
}

const joinGuild = async (guildID, user) => {
    const guild = await Guild.findOne({ snowflake: guildID });
    if (!guild) {
        return false;
    }

    const everyoneRole = await Role.findOne({ guild: guildID, name: "@everyone" });
    if (!everyoneRole) {
        return false;
    }

    everyoneRole.users.push(user);
    await everyoneRole.save();

    guild.members.push(user);
    await guild.save();

    return true;
}

module.exports = {
    createGuild
};
