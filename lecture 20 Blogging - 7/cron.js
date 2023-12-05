const cron = require("node-cron");
const blogSchema = require("./Schemas/BlogSchema");

//second, min, hr, month, year, week
function cleanUpBin() {
  cron.schedule("* 1 * * *", async () => {
    console.log("cron is working");

    //find the blog where isDeleted : true
    const deletedBlogs = await blogSchema.aggregate([
      { $match: { isDeleted: true } },
    ]);

    //console.log(deletedBlogs);
    // ------------------------>t1, t2
    // ---------------------------------->date.now()
    if (deletedBlogs.length > 0) {
      //compare the deletion time
      deletedBlogs.forEach(async (blog) => {
        const diff =
          (Date.now() - new Date(blog.deletionDateTime).getTime()) /
          (1000 * 60 * 60 * 24);

        if (diff > 30) {
          await blogSchema
            .findOneAndDelete({ _id: blog._id })
            .then(() => {
              console.log(`blog deleted successfully: ${blog._id}`);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  });
}

module.exports = cleanUpBin;
