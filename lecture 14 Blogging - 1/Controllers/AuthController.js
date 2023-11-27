const express = require("express");
const { cleanUpAndValidate } = require("../Utils/AuthUtil");
const userSchema = require("../Schemas/userSchema");
const AuthRouter = express.Router();

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

  const userObj = new userSchema({
    name: name,
    email: email,
    password: req.body.password,
    username: username,
  });

  try {
    const userDb = await userObj.save();

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

AuthRouter.post("/login", (req, res) => {
  return res.send("This is login");
});

module.exports = AuthRouter;

//index.js   routes  controller
