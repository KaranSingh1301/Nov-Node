const express = require("express");
const mongoose = require("mongoose");
const UserModel = require("./userSchema");

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/novTestDb`;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected succcessfully");
  })
  .catch((err) => {
    console.log(err);
  });

//api

app.get("/", (req, res) => {
  console.log("Home route");
  return res.send("Server is running");
});

//form api

app.get("/api/html", (req, res) => {
  return res.send(
    `<html>
    <body>
    <h1> This is your FORM </h1>

    <form action = "/form_submit" method="POST">
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

app.post("/form_submit", async (req, res) => {
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
    return res.send({
      status: 201,
      message: "User created successfully",
      data: userDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//index.js (user obj) <-----> userModel <-----> userSchema <-----> mongoose
