const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    remember: {
      type: Boolean,
      default: false,
    },
    memberSince: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    
  },
  { timestamps: true }
);
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};
userSchema.methods.comparePassword = function (enteredPassword) {
  console.log(enteredPassword, this.password);
  return bcrypt.compare(enteredPassword, this.password);
};
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
