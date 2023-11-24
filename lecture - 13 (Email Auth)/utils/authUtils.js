const validator = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const cleanupAndValidate = ({ email, password, username, name }) => {
  return new Promise((resolve, reject) => {
    if (!email || !username || !name || !password) {
      reject("Missing Credentials");
    }

    if (typeof email !== "string") reject("Invalid email type");
    if (typeof username !== "string") reject("Invalid username type");
    if (typeof password !== "string") reject("Invalid password type");

    if (username.length <= 2 || username.length > 30)
      reject("Username length should be 3-30 only");
    if (password.length <= 2 || password.length > 30)
      reject("password length should be 3-30 only");

    if (!validator.isEmail(email)) {
      reject("Invalid Email Format");
    }

    resolve();
  });
};

const genrateJWTToken = (email) => {
  const token = jwt.sign(email, process.env.SECRET_KEY);
  return token;
};

const sendVerificationToken = ({ email, verifiedToken }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: "shibasish3210@gmail.com",
      pass: "aduq ncro thlt ofeu",
    },
  });

  const mailOptions = {
    from: "shibasish3210@gmail.com",
    to: email,
    subject: "Email Verification for TODO APP",
    html: `Click <a href='http://localhost:8000/verifytoken/${verifiedToken}' >Here</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log("Email has been sent successfully: " + info.response);
  });
};

module.exports = { cleanupAndValidate, genrateJWTToken, sendVerificationToken };
