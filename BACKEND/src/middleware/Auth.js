const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // STEP : 1
    // Reading the token from the request Key
    const { token } = req.cookies;

    
    // STEP : 2
    // Validating the Token
    if (!token) {
      throw new Error("Token Not Valid!");
    }
    const decodedObj = jwt.verify(token, "#MyDevT1nder----");
    const { _id } = decodedObj;

    // STEP : 3
    // Finding the user
    const foundUser = await UserModel.findById(_id);

    if (!foundUser) {
      throw new Error("User not found!");
    }

    req.user = foundUser;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userAuth,
};
