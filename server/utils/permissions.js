const PERMISSIONS = {
    GUILD: {
        VIEW_CHANNELS: 1 << 0,
        SEND_MESSAGES: 1 << 1,
        READ_MESSAGE_HISTORY: 1 << 2,
        JOIN_VOICE_CHANNELS: 1 << 3,
        SPEAK_IN_VOICE_CHANNELS: 1 << 4,
        MANAGE_GUILD: 1 << 5,
        MANAGE_ROLES: 1 << 6,
        MANAGE_CHANNELS: 1 << 7,
        KICK_MEMBERS: 1 << 8,
    },
    CHANNEL: {
        VIEW_CHANNEL: 1 << 0,
        SEND_MESSAGES: 1 << 1,
        JOIN_VOICE_CHANNEL: 1 << 2,
        SPEAK_IN_VOICE_CHANNEL: 1 << 3,
        MANAGE_CHANNEL: 1 << 4,
    },
};

class Permissions {
    static get PERMISSIONS() {
        return PERMISSIONS;
    }

    static hasPermission(permissions, permission) {
        return (permissions & permission) === permission;
    }

    static addPermission(permissions, permission) {
        return permissions | permission;
    }

    static removePermission(permissions, permission) {
        return permissions & ~permission;
    }
}


module.exports = Permissions;
module.exports.PERMISSIONS = PERMISSIONS;