const userSchema = require("../Schemas/userSchema");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;

let User = class {
  username;
  name;
  email;
  password;

  constructor({ email, password, name, username }) {
    this.username = username;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      const hashedPassowrd = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT)
      );

      const userObj = new userSchema({
        name: this.name,
        email: this.email,
        username: this.username,
        password: hashedPassowrd,
      });

      try {
        const userDb = await userObj.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyUsernameAndEmailsExits({ email, username }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userExits = await userSchema.findOne({
          $or: [{ email }, { username }],
        });

        if (userExits && userExits.email === email) {
          reject("Email Already Exits");
        }

        if (userExits && userExits.username === username) {
          reject("Username Already Exits");
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserEmailUsername({ loginId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await userSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });

        if (!userDb) reject("User does not exits");

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyUserId({ userId }) {
    return new Promise(async (resolve, reject) => {
      if (!ObjectId.isValid(userId)) reject("Invalid userId format");

      try {
        const userDb = await userSchema.findOne({ _id: userId });
        if (!userDb) reject(`No user found with userId : ${userId}`);

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
