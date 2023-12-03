const express = require("express");
const FollowRouter = express.Router();
const User = require("../Models/UserModel");
const { followUser, followingUserList } = require("../Models/FollowModel");

FollowRouter.post("/follow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid follower userId",
      error: error,
    });
  }

  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid following userId",
      error: error,
    });
  }

  try {
    const followDb = await followUser({ followerUserId, followingUserId });
    return res.send({
      status: 201,
      message: "Follow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

// follow/following-list?skip=8
FollowRouter.get("/following-list", async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;
  const followerUserId = req.session.user.userId;

  //validate the userID
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid follower userId",
      error: error,
    });
  }

  try {
    const followingList = await followingUserList({ followerUserId, SKIP });

    return res.send({
      status: 200,
      message: "Read Success",
      data: followingList,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

module.exports = FollowRouter;
