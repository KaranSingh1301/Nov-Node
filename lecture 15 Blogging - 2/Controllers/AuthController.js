const express = require("express");
const { cleanUpAndValidate } = require("../Utils/AuthUtil");
const userSchema = require("../Schemas/userSchema");
const AuthRouter = express.Router();
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");

AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, name, password, email } = req.body;

  //clean the data
  try {
    await cleanUpAndValidate({ email, username, password, name });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data related error",
      error: error,
    });
  }

  try {
    await User.verifyUsernameAndEmailsExits({ email, username });

    const userObj = new User({
      name,
      email,
      password,
      username,
    });

    const userDb = await userObj.registerUser();

    return res.send({
      status: 201,
      message: "Registeration successfull",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

AuthRouter.post("/login", async (req, res) => {
  //loginId, password
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }

  try {
    const userDb = await User.findUserEmailUsername({ loginId });

    //compare the passoword

    const isMatch = await bcrypt.compare(password, userDb.password);

    if (!isMatch) {
      return res.send({
        status: 400,
        message: "Wrong Password",
      });
    }

    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };

    return res.send({
      status: 200,
      message: "Login Successfull",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

module.exports = AuthRouter;

//index.js   routes  controller

//Schema<--->Model(User)<---->Controllers<--->server(index.js)<--------->Client
