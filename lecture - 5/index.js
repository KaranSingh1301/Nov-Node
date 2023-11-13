const express = require("express");
const mongoose = require("mongoose");
const UserModel = require("./userSchema");
require("dotenv").config();
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);
const isAuth = require("./middleware/isAuth");

//constants
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/novTestDb`;
const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

//mongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected succcessfully");
  })
  .catch((err) => {
    console.log(err);
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//api

app.get("/", (req, res) => {
  console.log("Home route");
  return res.send("Server is running");
});

//form api

app.get("/register", (req, res) => {
  return res.send(
    `<html>
    <body>
    <h1> Registration </h1>

    <form action = "/registration_form_submit" method="POST">
    <label for="name"> Name </label>
    <input type="text" name='name'> </input>
    <br/>
    <label for="email"> Email </label>
    <input type="text" name='email'> </input>
    <br/>
    <label for="password"> Password </label>
    <input type="text" name='password'> </input>
    <br/>
    <button type='submit'> Submit </button>
    </form>


    <body/>
    <html/>
        `
  );
});

app.post("/registration_form_submit", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const userObj = new UserModel({
    //schema : Client
    name: name,
    email: email,
    password: password,
  });

  //whenever there is a async or I/O bound function put try catch
  console.log(userObj);
  try {
    const userDb = await userObj.save();
    console.log(userDb);
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

//login

app.get("/login", (req, res) => {
  return res.send(
    `<html>
    <body>
    <h1> Login </h1>

    <form action = "/login_form_submit" method="POST">
    <label for="email"> Email </label>
    <input type="text" name='email'> </input>
    <br/>
    <label for="password"> Password </label>
    <input type="text" name='password'> </input>
    <br/>
    <button type='submit'> Submit </button>
    </form>
    <body/>
    <html/>
        `
  );
});

app.post("/login_form_submit", async (req, res) => {
  const { email, password } = req.body;

  try {
    //first check if email exist in DB.
    const userDb = await UserModel.findOne({ email });

    //if user not found
    if (!userDb) {
      return res.send({
        status: 403,
        message: "User not found, please register first.",
      });
    }

    //compare the passwords

    if (password !== userDb.password) {
      return res.send({
        status: 403,
        message: "Password does not matched",
      });
    }

    req.session.isAuth = true;

    return res.redirect("/dashboard");
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.get("/dashboard", isAuth, (req, res) => {
  return res.send("This is your dashboard");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//index.js (user obj) <-----> userModel <-----> userSchema <-----> mongoose
