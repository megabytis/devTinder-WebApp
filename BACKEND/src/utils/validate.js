const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Not a Strong Password!");
  }
};

const validateEditProfileData = (req) => {
  const dataUserWannaModify = req.body;
  const ALLOWED_UPDATES_LIST = [
    "firstName",
    "lastName",
    "age",
    "photoURL",
    "skills",
    "about",
    "gender",
  ];

  const isUpdateAllowed = Object.keys(dataUserWannaModify).every((key) =>
    ALLOWED_UPDATES_LIST.includes(key)
  );

  if (!isUpdateAllowed) {
    throw new Error("Update Not Allowed!");
  }
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
};
