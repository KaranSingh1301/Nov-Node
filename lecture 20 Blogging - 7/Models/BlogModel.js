const BlogSchema = require("../Schemas/BlogSchema");
const blogSchema = require("../Schemas/BlogSchema");
const { LIMIT } = require("../privateConstants");
const ObjectId = require("mongodb").ObjectId;

let Blog = class {
  title;
  textBody;
  userId;
  creationDateTime;
  blogId;

  constructor({ title, textBody, userId, creationDateTime, blogId }) {
    this.title = title;
    this.textBody = textBody;
    this.creationDateTime = creationDateTime;
    this.userId = userId;
    this.blogId = blogId;
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

  static getBlogs({ followingUserIds, SKIP }) {
    return new Promise(async (resolve, reject) => {
      //pagination, sort
      try {
        const blogDb = await blogSchema.aggregate([
          {
            $match: {
              userId: { $in: followingUserIds },
              isDeleted: { $ne: true },
            },
          },
          {
            $sort: { creationDateTime: 1 },
          },
          {
            $facet: {
              data: [{ $skip: SKIP }, { $limit: LIMIT }],
            },
          },
        ]);

        // console.log(blogDb[0].data);
        resolve(blogDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }

  static myBlogs({ SKIP, userId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const myBlogsDb = await blogSchema.aggregate([
          {
            $match: { userId: new ObjectId(userId), isDeleted: { $ne: true } },
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

        resolve(myBlogsDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getBlogWithId({ blogId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blogDb = await blogSchema.findOne({ _id: blogId });
        if (!blogDb) {
          reject(`No blog found with this id : ${blogId}`);
        }
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateBlog() {
    return new Promise(async (resolve, reject) => {
      let newBlogData = {};
      console.log(newBlogData);
      try {
        if (this.title) {
          newBlogData.title = this.title;
        }

        if (this.textBody) {
          newBlogData.textBody = this.textBody;
        }
        console.log(newBlogData);

        const oldBlogData = await blogSchema.findOneAndUpdate(
          { _id: this.blogId },
          newBlogData
        );
        resolve(oldBlogData);
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteBlog({ blogId }) {
    return new Promise(async (resolve, reject) => {
      try {
        // const deletedBlogDb = await blogSchema.findOneAndDelete({
        //   _id: blogId,
        // });

        const deletedBlogDb = await BlogSchema.findByIdAndUpdate(
          { _id: blogId },
          { isDeleted: true, deletionDateTime: new Date() }
        );

        resolve(deletedBlogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  //pagination, sort, match
};

module.exports = Blog;
