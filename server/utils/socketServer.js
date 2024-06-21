const jwt = require("jsonwebtoken");
const { RealTimeUser: RealTimeUserModel } = require("../db");

module.exports = server => {
    const io = require("socket.io")(server, {
        cors: {
            methods: ["GET", "POST"],
            credentials: true,
            origin: "http://localhost:5173"
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }

        jwt.verify(token, process.env.JWT, (err, decoded) => {
            if (err) {
                return next(new Error("Authentication error"));
            }

            socket.user = decoded;
            next();
        });
    });

    io.on("connection", async (socket) => {
        const user = socket.user;

        let realTimeUser = await RealTimeUserModel.findOne({ snowflake: user.snowflake });
        if (!realTimeUser) {
            realTimeUser = new RealTimeUserModel({
                snowflake: user.snowflake,
                onlineStatus: 1, // 0 = offline, 1 = online, 2 = away 3 = do not disturb
                activity: "",
                typing: false,
                typingIn: "",
                socketId: socket.id
            });
        } else {
            realTimeUser.socketId = socket.id;
            realTimeUser.onlineStatus = 1;
        }
        
        await realTimeUser.save();

        socket.on("disconnect", async () => {
            const user = socket.user;
            const realTimeUser = await RealTimeUserModel.findOne({ snowflake: user.snowflake });
            if (realTimeUser) {
                realTimeUser.onlineStatus = 0;
                await realTimeUser.save();
            }
        });
    });

    return io;
};
