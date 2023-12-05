const BlogDataValidate = ({ title, textBody, userId }) => {
  return new Promise((resolve, reject) => {
    if (!title || !textBody || !userId) {
      reject("Missing credentials");
    }

    if (typeof title !== "string") reject("title is not a string");
    if (typeof textBody !== "string") reject("textBody is not a string");

    resolve();
  });
};

module.exports = { BlogDataValidate };
