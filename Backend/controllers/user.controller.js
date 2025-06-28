const User = require("../models/user.model");

module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    if (!name || !email || !password) {
      return res.status(404).json({ message: "Email or Password missing" });
    }
    const alreadyExist = await User.findOne({ email });
    console.log(alreadyExist);
    if (alreadyExist) {
      return res.status(404).json({ message: "User Already Exists" });
    }
    const hashedPassword = await User.hashPassword(password);
    console.log(hashedPassword);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = await user.generateAuthToken();
    res.cookie("token", token);
    console.log("user", user);
    return res.status(201).json({ user, token });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json("server is down");
  }
};

module.exports.login = async (req, res, next) => {
  try {
    console.log("yaha pr aye hai");
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .send(400)
        .json({ message: "Please enter your email or password" });
    }
    const user = await User.findOne({ email });
    console.log("password", password);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comparePassword = await user.comparePassword(password);
    console.log(comparePassword);
    if (!comparePassword) {
      return res.send(400).json({ message: "Password is Incorrect" });
    }
    const token = await user.generateAuthToken();
    console.log(token);
    res.cookie("token", token);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json("server is down");
  }
};
