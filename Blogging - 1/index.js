const express = require("express");
const clc = require("cli-color");
require("dotenv").config();

//file imports
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");

//contants
const app = express();
const PORT = process.env.PORT;

//middleware
app.use(express.json());

//auth
app.use("/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(clc.yellowBright.underline(`Server is running on PORT: ${PORT}`));
});
