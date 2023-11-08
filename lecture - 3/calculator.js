const express = require("express");

const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log(req.query);
  return res.send("Server is running");
});

//add api
app.post("/add", (req, res) => {
  const { num1, num2 } = req.body;
  console.log(typeof num1);

  //data validation
  if (typeof num1 !== "number" || typeof num2 !== "number") {
    return res.send("Data format invalid");
  }

  const sum = num1 + num2;

  return res.send({
    status: 200,
    result: sum,
  });
});

//sub
app.get("/subtract", (req, res) => {
  const num1 = parseInt(req.query.num1);
  const num2 = parseInt(req.query.num2);

  const difference = num1 > num2 ? num1 - num2 : num2 - num1;

  return res.send({
    status: 200,
    result: difference,
  });
});

//mul
app.get("/mul/:num1/:num2", (req, res) => {
  const num1 = parseInt(req.params.num1);
  const num2 = parseInt(req.params.num2);
  //   console.log(num1, num2);
  //   const result = num1 * num2;
  return res.send({
    result: num1 * num2,
  });
});

//divide
app.get("/divide/:a/:b", (req, res) => {
  const a = req.params.a;
  const b = req.params.b;
  if (Number(req.params.b) === 0) {
    return res.send({
      status: 200,
      result: `Invalid as denominator can't be 0`,
    });
  }
  res.send(`Division Result is:${Number(a) / Number(b)}`);
});

app.listen(PORT, () => {
  console.log(`calculator is running on port ${PORT}`);
});
