const validator = require("validator");

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

module.exports = { cleanupAndValidate };
