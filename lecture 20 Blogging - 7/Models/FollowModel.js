const followSchema = require("../Schemas/FollowSchema");
const userSchema = require("../Schemas/userSchema");
const { LIMIT } = require("../privateConstants");
const ObjectId = require("mongodb").ObjectId;

const followUser = async ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check if the follow exist or not

      const followExist = await followSchema.findOne({
        followerUserId,
        followingUserId,
      });

      if (followExist) {
        return reject("Already following the user");
      }

      //create a entry in DB

      const followObj = new followSchema({
        followerUserId,
        followingUserId,
        creationDateTime: Date.now(),
      });

      const followDb = await followObj.save();
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const followingUserList = ({ followerUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    //match, sort, pagination
    try {
      const followingList = await followSchema.aggregate([
        {
          $match: {
            followerUserId: new ObjectId(followerUserId),
          },
        },
        {
          $sort: { creationDateTime: -1 },
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);

      //populate the data

      //   const followDb = await followSchema
      //     .find({ followerUserId })
      //     .populate("followingUserId")
      //     .sort({creationDateTime :-1})

      let followingUserIds = [];

      followingList[0].data.map((followObj) => {
        followingUserIds.push(followObj.followingUserId);
      });

      // followingUserIds.map(async(userId)=>{
      //   const userData = await userSchema.findOne({_id : userId})
      //   Array.push(userData)
      // })

      const followingUserDetails = await userSchema.aggregate([
        {
          $match: {
            _id: { $in: followingUserIds },
          },
        },
      ]);

      // console.log(followingUserDetails);
      resolve(followingUserDetails.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const followerUserList = ({ followingUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followerDb = await followSchema.aggregate([
        { $match: { followingUserId: new ObjectId(followingUserId) } },
        { $sort: { creationDateTime: -1 } },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      console.log(followerDb[0].data);
      let followerUserIds = [];

      followerDb[0].data.map((followerObj) => {
        followerUserIds.push(followerObj.followerUserId);
      });
      console.log(followerUserIds);
      const followerUserDetails = await userSchema.aggregate([
        {
          $match: { _id: { $in: followerUserIds } },
        },
      ]);
      console.log(followerUserDetails);
      resolve(followerUserDetails.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const unfollowUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await followSchema.findOneAndDelete({
        followerUserId,
        followingUserId,
      });
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  followUser,
  followingUserList,
  followerUserList,
  unfollowUser,
};

// test --->  test2, test1
// test3 ---> test, test1
//test2 ----> test1
