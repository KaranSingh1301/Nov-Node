//ES5
const express = require("express");

const app = express();

//api
app.get("/", (req, res) => {
  console.log("`/`, GET REQUST");
  return res.send("This is your server");
});

app.get("/home", (req, res) => {
  console.log("/homessss, GET");
  return res.send("This is home page");
});

//query

app.get("/api", (req, res) => {
  console.log(req.query);
  console.log(req.query.key.split(","));
  return res.send("success /api");
});

//params

app.get("/api1/:id", (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  return res.send(`success api1/${id}`);
});

app.get("/api2/:id/:dev", (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  return res.send(`success api2/${req.params.id}/${req.params.dev}`);
});

//listener
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

// console.log("server is running");
