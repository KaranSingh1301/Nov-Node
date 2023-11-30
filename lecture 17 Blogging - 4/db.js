const mongoose = require("mongoose");
const clc = require("cli-color");

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log(clc.blueBright("MongoDb connected successfully"));
  })
  .catch((err) => {
    console.log(clc.redBright(err));
  });
