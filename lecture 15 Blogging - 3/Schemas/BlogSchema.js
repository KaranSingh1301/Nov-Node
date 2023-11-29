const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 50,
  },
  textBody: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 1000,
  },
  creationDateTime: {
    type: String,
    require: true,
  },
  userId: {
    //fk to userSchema
    type: Schema.Types.ObjectId,
    require: true,
  },
});

module.exports = mongoose.model("blog", blogSchema);
