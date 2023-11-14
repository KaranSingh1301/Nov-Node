const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const mongoose = require("mongoose");
const userModel = require("./Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { cleanupAndValidate } = require("./utils/authUtils");
const { resolveSoa } = require("dns");

//constants
const app = express();
const PORT = process.env.PORT;

//mongoDb Connections
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(clc.yellow("MongoDb Connected Successfully"));
  })
  .catch((err) => {
    console.log(clc.red(err));
  });

//middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  return res.send("This is your SERVER");
});

app.get("/register", (req, res) => {
  return res.render("register");
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, password, username } = req.body;

  //data validation
  try {
    await cleanupAndValidate({ email, name, password, username });
  } catch (error) {
    return res.send({
      status: 400,
      message: "User Data Error",
      error: error,
      data: req.body,
    });
  }

  //check if email and username exits or not
  const userEmailExists = await userModel.findOne({ email });
  if (userEmailExists) {
    return res.send({
      status: 400,
      message: "Email already exits",
    });
  }

  const userUsernameExists = await userModel.findOne({ username });
  if (userUsernameExists) {
    return res.send({
      status: 400,
      message: "Username already exits",
    });
  }

  //hashed the password
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT)
  );
  console.log(hashedPassword);
  //save the user in DB
  const userObj = new userModel({
    name: name,
    email: email,
    password: hashedPassword,
    username: username,
  });

  try {
    const userDb = await userObj.save();
    console.log(userDb);
    return res.redirect("/login");
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.get("/login", (req, res) => {
  return res.render("login");
});

app.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  //data validation
  if (!loginId || !password)
    return res.send({
      status: 400,
      message: "Missing credentials",
    });

  if (typeof loginId !== "string" || typeof password !== "string") {
    return res.send({
      status: 400,
      message: "Invalid data format",
    });
  }

  try {
    let userDb;
    //either username or email
    if (validator.isEmail(loginId)) {
      userDb = await userModel.findOne({ email: loginId });
      if (!userDb) {
        return res.send({
          status: 400,
          message: "Wrong email",
        });
      }
    } else {
      userDb = await userModel.findOne({ username: loginId });
      if (!userDb) {
        return res.send({
          status: 400,
          message: "Wrong username",
        });
      }
    }

    //password comparison
    const isMatched = await bcrypt.compare(password, userDb.password);
    if (!isMatched) {
      return res.send({
        status: 400,
        message: "Incorrect Passoword",
      });
    }

    return res.send({
      status: 200,
      message: "Login Successfull",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database Error",
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(clc.yellow("Server is running on:"));
  console.log(clc.yellow.underline(`http://localhost:${PORT}/`));
});

//mongodb Connection

//Register Page
//Register API

//Login Page
//login API

//Session base Auth

//Dashboard Page
//logout
//logout from all devices

//Todo API
//Create
//edit
//delete
//read

//Dashboard
//Axios - GET and POST
//Read component

//Pagination API
//Rate limiting
