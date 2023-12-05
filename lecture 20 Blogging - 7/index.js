const express = require("express");
const clc = require("cli-color");
require("dotenv").config();
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file imports
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");
const { isAuth } = require("./Middlewares/AuthMiddleware");
const BlogRouter = require("./Controllers/BlogController");
const FollowRouter = require("./Controllers/FollowController");
const cleanUpBin = require("./cron");

//contants
const app = express();
const PORT = process.env.PORT;
const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middleware
app.use(express.json());

//session-base-auth

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//auth

//   /follow/follow-user

app.use("/auth", AuthRouter);
app.use("/blog", isAuth, BlogRouter);
app.use("/follow", isAuth, FollowRouter);

app.listen(PORT, () => {
  console.log(clc.yellowBright.underline(`Server is running on PORT: ${PORT}`));
  cleanUpBin();
});
