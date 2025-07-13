const User = require("../models/user.model");

module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log("Registration request:", req.body);
    
    if (!name || !email || !password) {
      return res.status(404).json({ message: "Email or Password missing" });
    }
    
    const alreadyExist = await User.findOne({ email });
    console.log("User exists check:", alreadyExist);
    
    if (alreadyExist) {
      return res.status(404).json({ message: "User Already Exists" });
    }
    
    const hashedPassword = await User.hashPassword(password);
    console.log("Password hashed successfully");
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      memberSince: new Date().toISOString() // Adding the required memberSince field
    });
    
    const token = await user.generateAuthToken();
    res.cookie("token", token);
    console.log("User created successfully:", user);
    return res.status(201).json({ user, token });
  } catch (error) {
    console.log("Registration error details:", error.message);
    console.log("Full error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    console.log("Login request:", req.body);
    const { email, password, rememberMe } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter your email or password" });
    }
    
    const user = await User.findOne({ email });
    console.log("User found:", user ? user.email : "Not found");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const comparePassword = await user.comparePassword(password);
    console.log("Password comparison result:", comparePassword);
    
    if (!comparePassword) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    
    const token = await user.generateAuthToken();
    console.log("Generated token successfully");
    
    res.cookie("token", token);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log("Login error:", error.message);
    console.log("Full error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};
