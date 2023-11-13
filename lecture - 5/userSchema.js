const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
    require: true,
  },
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;

//module.exports = mongoose.model("user", userSchema);
