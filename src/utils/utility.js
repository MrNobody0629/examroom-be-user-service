const bcrypt = require("bcryptjs");
const { SALT_ROUNDS, JWT_SECRET } = require("../constants");
const jwt = require("jsonwebtoken");

const generateHash = (string) => {
  return bcrypt.hash(string, SALT_ROUNDS);
};

const verifyHash = (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};

const generateToken = (data, isRemember = false) => {
  if (isRemember) {
    return jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });
  } else {
    return jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });
  }
};

module.exports = {
  generateHash,
  verifyHash,
  generateToken,
};
