const jwt = require("jsonwebtoken");
const User = require("../user/model/userModel");

const verifyToken =async (req, res, next) => {
    let authHeader = req.header("authorization");
    if (authHeader) {
      authHeader = authHeader.split(" ");
      const token = authHeader[1];
      if (!token) {
        return res
          .status(403)
          .send({ message: "A token is required for authentication" });
      }
      try {
        const getuser = jwt.verify(token, "test1234");
        req.user = getuser;
        next();
      } catch (err) {
        return res.status(401).send({ message: "Token is not valid!" });
      }
    } else {
      return res
        .status(403)
        .send({ message: "A token is required for authentication" });
    }
  };
const verifyTokenAndUser = async (req, res, next) => {
    let authHeader = req.header("authorization");
    if (authHeader) {
      authHeader = authHeader.split(" ");
      const token = authHeader[1];
      if (!token) {
        return res
          .status(403)
          .send({ message: "A token is required for authentication" });
      }
      try {
        const getuser = jwt.verify(token, "test1234");
        console.log("67====",getuser);
        // console.log(getuser)
        const user = await User.findById(getuser._id);
        console.log(user);
        if (!user) {
          return res.status(403).json({
            status: 0,
            message: "You are not  user.!",
          });
        } else {
          // next();
  
          req.user = getuser;
          next();
        }
      } catch (err) {
        console.log(err);
        return res.status(401).send({ message: "Token is not valid!" });
      }
    } else {
      return res
        .status(403)
        .send({ message: "A token is required for authentication" });
    }
  };
module.exports = {
    verifyToken,verifyTokenAndUser
}