const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    return res.send("Please login again.");
  }
};

module.exports = isAuth;
