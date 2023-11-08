const express = require("express");

const app = express();
const PORT = process.env.PORT || 8001;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post("/form_submit", (req, res) => {
  console.log(req.body);
  return res.send("Form sumitted successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
