const mongoose = require("mongoose");
const userSchema = require("./User");

exports.User = mongoose.model("users", userSchema);
