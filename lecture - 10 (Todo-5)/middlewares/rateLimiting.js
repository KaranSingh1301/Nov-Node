const accessModel = require("../Models/accessModel");

const rateLimitng = async (req, res, next) => {
  console.log(req.session.id);
  const sessionId = req.session.id;

  //check if the person if making the request for the first time

  //find the entry with this sessionId

  try {
    const accessDb = await accessModel.findOne({ sessionId: sessionId });

    //this is the first request, accessDb is null

    if (!accessDb) {
      //create a new entry in Db
      const accessObj = new accessModel({
        sessionId: sessionId,
        time: Date.now(),
      });

      await accessObj.save();
      next();
      return;
    }

    //if accessDb is not null, this is not a first request, compare the time
    const diff = (Date.now() - accessDb.time) / 1000;
    console.log(diff);

    if (diff < 5) {
      return res.send({
        status: 400,
        message: "Too many requests, Please wait for some time",
      });
    }

    //update the time and then call the next()

    await accessModel.findOneAndUpdate({ sessionId }, { time: Date.now() });
    next();
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
};

module.exports = rateLimitng;
