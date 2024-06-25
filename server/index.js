const express = require("express");
const cors = require("cors");
const creator = require("./utils/creator");

require("dotenv").config();


const app = express();
const server = require("http").createServer(app);

require("./utils/socketServer")(server);

const apiVersions = {
  v1: require("./api/v1"),
};
const emailRouter = require("./routers/email");
const cdnRouter = require("./routers/cdn");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/:version", (req, res, next) => {
  const version = req.params.version;
  if (apiVersions[version]) {
    return apiVersions[version](req, res, next);
  }
  res.status(404).send("API version not found");
});

app.use("/email", emailRouter);
app.use("/cdn", cdnRouter);


server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});