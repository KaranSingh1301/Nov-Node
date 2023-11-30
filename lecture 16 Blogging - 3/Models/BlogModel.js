const blogSchema = require("../Schemas/BlogSchema");
const { LIMIT } = require("../privateConstants");

let Blog = class {
  title;
  textBody;
  userId;
  creationDateTime;

  constructor({ title, textBody, userId, creationDateTime }) {
    this.title = title;
    this.textBody = textBody;
    this.creationDateTime = creationDateTime;
    this.userId = userId;
  }

  createBlog() {
    return new Promise(async (resolve, reject) => {
      this.title.trim();
      this.textBody.trim();

      const blog = new blogSchema({
        title: this.title,
        textBody: this.textBody,
        creationDateTime: this.creationDateTime,
        userId: this.userId,
      });

      try {
        const blogDb = await blog.save();
        resolve(blogDb);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static getBlogs({ SKIP }) {
    return new Promise(async (resolve, reject) => {
      //pagination, sort
      try {
        const blogDb = await blogSchema.aggregate([
          {
            $sort: { creationDateTime: -1 },
          },
          {
            $facet: {
              data: [{ $skip: SKIP }, { $limit: LIMIT }],
            },
          },
        ]);

        console.log(blogDb[0].data);
        resolve(blogDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }

  //pagination, sort, match
};

module.exports = Blog;
