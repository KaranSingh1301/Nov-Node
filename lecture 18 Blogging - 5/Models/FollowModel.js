const followSchema = require("../Schemas/FollowSchema");
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

      console.log(followingList[0].data);
      resolve(followingList[0].data);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { followUser, followingUserList };

// test ---> test1, test2, test3
// test3 ---> test, test1
