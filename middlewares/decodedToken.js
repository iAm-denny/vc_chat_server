const jwt = require("jsonwebtoken");
require("dotenv").config();

const decodedToken = (token) => {
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) null;
      return decoded;
    } catch (err) {
      console.log("err", err);
      return null;
    }
  }

  return null;
};
module.exports = { decodedToken };
