const express = require("express");
const { BlogDataValidate } = require("../Utils/BlogUtil");
const BlogRouter = express.Router();
const User = require("../Models/UserModel");
const Blog = require("../Models/BlogModel");

BlogRouter.post("/create-blog", async (req, res) => {
  console.log(req.body);
  const { title, textBody } = req.body;
  const userId = req.session.user.userId;
  const creationDateTime = new Date();

  //data validation
  try {
    await BlogDataValidate({ title, textBody, userId });
    const userDb = await User.verifyUserId({ userId });
  } catch (error) {
    return res.send({
      status: 400,
      error: error,
    });
  }

  //fun<---blogmodel
  const blogObj = new Blog({ title, textBody, userId, creationDateTime });

  try {
    const blogDb = await blogObj.createBlog();

    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      error: error,
    });
  }
});

// /blog/get-blogs?skip=10
BlogRouter.get("/get-blogs", async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;

  try {
    const blogDb = await Blog.getBlogs({ SKIP });
    return res.send({
      status: 200,
      message: "Read success",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      error: error,
    });
  }
});

module.exports = BlogRouter;
