const express = require("express");
const mysql = require("mysql");
const app = express();

app.use(express.json());

//mysql connection

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Karan@130101",
  database: "tododb",
  multipleStatements: true,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Mysql Db is connected");
});

app.get("/mysql", (req, res) => {
  return res.send("Nodejs with mysql is running");
});

app.get("/user", (req, res) => {
  db.query("SELECT * FROM user", {}, (err, users) => {
    console.log(users);
    if (users) {
      return res.send({
        status: 200,
        message: "Read success",
        data: users,
      });
    } else {
      return res.send({
        status: 500,
        message: "Database error",
        error: err,
      });
    }
  });
});

app.post("/create-user", (req, res) => {
  console.log(req.body);
  const { user_id, email, name, password } = req.body;

  db.query(
    "INSERT INTO user (user_id, name, email, password) VALUES (?,?,?,?)",
    [user_id, name, email, password],
    (err, user) => {
      console.log(user);
      if (err) {
        console.log(err);
      } else {
        return res.send(true);
      }
    }
  );
});

app.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
