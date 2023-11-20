const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const mongoose = require("mongoose");
const userModel = require("./Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);
const { cleanupAndValidate } = require("./utils/authUtils");
const { isAuth } = require("./middlewares/isAuth");
const todoModel = require("./Models/todoModel");

//constants
const app = express();
const PORT = process.env.PORT;
const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

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
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(express.static("public"));

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
    // await userModel.findOne({
    //   $or: [{email: loginId},{username : loginId}]
    // })

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

    //session
    console.log(req.session);
    req.session.isAuth = true;
    req.session.user = {
      username: userDb.username,
      email: userDb.email,
      userId: userDb._id,
    };

    return res.redirect("/dashboard");
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database Error",
      error: error,
    });
  }
});

app.get("/dashboard", isAuth, async (req, res) => {
  return res.render("dashboard");
});

//logout
app.post("/logout", isAuth, (req, res) => {
  req.session.destroy((error) => {
    if (error) throw error;
    return res.redirect("/login");
  });
});

app.post("/logout_from_all_devices", isAuth, async (req, res) => {
  //create the session schema
  const sessionSchema = new mongoose.Schema({ _id: String }, { strict: false });
  const sessionModel = mongoose.model("session", sessionSchema);

  //get the user data who is making the request
  const username = req.session.user.username;

  //delete the sessions from db
  try {
    const deleteDb = await sessionModel.deleteMany({
      "session.user.username": username,
    });
    console.log(deleteDb);
    return res.redirect("/login");
  } catch (error) {
    return res.send({
      status: 500,
      message: "logout unsuccessfull",
      error: error,
    });
  }
});

//todo
app.post("/create-item", isAuth, async (req, res) => {
  const todoText = req.body.todo;
  const username = req.session.user.username;

  //data validation
  if (!todoText) {
    return res.send({
      status: 400,
      message: "Missing todo text",
    });
  } else if (typeof todoText !== "string") {
    return res.send({
      status: 400,
      message: "Invalid Todo format",
    });
  } else if (todoText.length < 3 || todoText.length > 100) {
    return res.send({
      status: 400,
      message: "Length of todo text should be 3-100",
    });
  }

  //make the entry in DB
  const todoObj = new todoModel({
    todo: todoText,
    username: username,
  });

  try {
    const todoDb = await todoObj.save();
    console.log(todoDb);
    return res.send({
      status: 201,
      message: "Todo created successfully",
      data: todoDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

//edit
//check the ownership
// find the todo and update the todo with new data

app.post("/edit-item", isAuth, async (req, res) => {
  console.log(req.body);
  const { id, newData } = req.body;
  const username = req.session.user.username;

  if (!newData || !id) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }

  if (newData.length < 3 || newData.length > 100) {
    return res.send({
      status: 400,
      message: "Todo length should be 3 to 100",
    });
  }

  //find the todo with todoID
  try {
    const todoDb = await todoModel.findOne({ _id: id });

    console.log(todoDb);

    //check ownership
    if (todoDb.username !== username) {
      return res.send({
        status: 403,
        message: "Not allowed to edit, authorisation failed",
      });
    }

    //update the todo in DB

    const todoPrev = await todoModel.findOneAndUpdate(
      { _id: id },
      { todo: newData }
    );
    console.log(todoPrev);

    return res.send({
      status: 200,
      message: "Todo has been updated successfully",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

//delete
//username
// todoId
//data vaiildation
//check the owenership
//delete the respective todo

app.post("/delete-item", isAuth, async (req, res) => {
  const { id } = req.body;
  const username = req.session.user.username;

  if (!id) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }

  //find the todo with todoID
  try {
    const todoDetails = await todoModel.findOne({ _id: id });

    //check ownership
    if (todoDetails.username !== username) {
      return res.send({
        status: 403,
        message: "Not allowed to delete, authorisation failed",
      });
    }

    //update the todo in DB

    const todoDb = await todoModel.findOneAndDelete({ _id: id });
    //console.log("hello", todoDb);

    return res.send({
      status: 200,
      message: "Todo has been deleted successfully",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.get("/read-item", isAuth, async (req, res) => {
  const username = req.session.user.username;

  try {
    const todoDb = await todoModel.find({ username: username });
    console.log(todoDb);
    return res.send({
      status: 200,
      message: "Read successfull",
      data: todoDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database Error",
      error: error,
    });
  }
});

//pagination_dashboard?skip=10
app.get("/pagination_dashboard", isAuth, async (req, res) => {
  const SKIP = req.query.skip || 0;
  const LIMIT = 5;
  const username = req.session.user.username;

  //mongodb aggregate functions
  //pagination
  //match

  try {
    const todoDb = await todoModel.aggregate([
      {
        $match: { username: username },
      },
      {
        $facet: {
          data: [{ $skip: parseInt(SKIP) }, { $limit: LIMIT }],
        },
      },
    ]);

    console.log(todoDb[0].data);

    return res.send({
      status: 200,
      message: "Read  successfull",
      data: todoDb[0].data,
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
//Middleware Auth

//logout
//logout from all devices

//Dashboard Page

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
