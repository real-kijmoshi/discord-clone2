const snowflake = require("./utils/snowflake");

snowflake.nextId("channel");

console.log(snowflake.nextId("channel").toString());