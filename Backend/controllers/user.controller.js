const User = require("../models/user.model");
// const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log("Registration request:", req.body);

    if (!name || !email || !password) {
      console.log("Testing 1");
      return res.status(404).json({ message: "Email or Password missing" });
    }

    const alreadyExist = await User.findOne({ email });
    console.log("User exists check:", alreadyExist);

    if (alreadyExist) {
      console.log("Testing 2");
      return res.status(404).json({ message: "User Already Exists" });
    }

    const hashedPassword = await User.hashPassword(password);
    console.log("Password hashed successfully");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      memberSince: new Date().toISOString(), // Adding the required memberSince field
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
      return res
        .status(400)
        .json({ message: "Please enter your email or password" });
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

module.exports.sendOtp = async (req, res, next) => {
  console.log("sendOtp me yaha aa rha ha");
  try {
    const { email } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      // If user exists, check if they are already verified
      if (user.isVerified) {
        return res
          .status(400)
          .json({ message: "User already Exist Please Sigin" });
      }
    }

    if (!user) {
      // Create temporary user
      user = new User({
        email,
        password: "temporary", // Will be updated during verification
        name: "temporary",
      });
    }
    // Generate OTP
    const otp = await user.generateOTP();
    console.log("otp : ", otp);
    // user.otp = otp;
    // user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save({ validateModifiedOnly: true });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your AlgoViz account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          
          <div style="
            max-width: 600px;
            margin: 40px auto;
            background-color: #1e293b;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            border: 1px solid #334155;
          ">
            
            <!-- Header with Gradient Border Top -->
            <div style="
              height: 6px;
              background: linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6);
              width: 100%;
            "></div>

            <div style="padding: 40px 40px 20px 40px; text-align: center;">
              <!-- Logo Text -->
              <h1 style="
                margin: 0;
                font-size: 32px;
                font-weight: 800;
                color: #ffffff;
                letter-spacing: -1px;
              ">
                Algo<span style="color: #22d3ee;">Viz</span>
              </h1>
            </div>

            <div style="padding: 20px 40px 40px 40px;">
              <h2 style="
                margin-top: 0;
                font-size: 24px;
                font-weight: 600;
                color: #f1f5f9;
                text-align: center;
              ">Verify Your Identity</h2>
              
              <p style="
                font-size: 16px;
                line-height: 1.6;
                color: #cbd5e1;
                text-align: center;
                margin-bottom: 30px;
              ">
                Welcome to AlgoViz! To secure your account and start mastering algorithms, please enter the following verification code:
              </p>

              <!-- OTP Container -->
              <div style="
                background: rgba(6, 182, 212, 0.05);
                border: 1px solid rgba(6, 182, 212, 0.3);
                border-radius: 16px;
                padding: 30px;
                text-align: center;
                margin-bottom: 30px;
              ">
                <p style="
                  margin: 0 0 10px 0;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 1.5px;
                  color: #22d3ee;
                  font-weight: 600;
                ">Verification Code</p>
                <h1 style="
                  font-size: 42px;
                  margin: 0;
                  letter-spacing: 6px;
                  font-family: 'Courier New', monospace;
                  color: #ffffff;
                  font-weight: 700;
                ">${otp}</h1>
              </div>

              <div style="text-align: center; font-size: 14px; color: #94a3b8;">
                <p style="margin: 0;">⏳ This code expires in 10 minutes.</p>
                <p style="margin: 10px 0 0 0;">If you didn't request this code, you can safely ignore this email.</p>
              </div>
            </div>

            <!-- Footer -->
            <div style="
              background-color: #0f172a;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #334155;
            ">
              <p style="margin: 0; font-size: 13px; color: #64748b;">
                © ${new Date().getFullYear()} AlgoViz Platform. All rights reserved.
              </p>
              <div style="margin-top: 15px;">
                <a href="#" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">Privacy Policy</a>
                <span style="color: #334155;">|</span>
                <a href="#" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">Help Center</a>
              </div>
            </div>
          </div>
          
        </body>
        </html>
      `,
    });
    const check = await User.find({ email });
    console.log(check);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  console.log("verifyOtp me yaha aa rha ha");
  try {
    const { email, otp, name, password } = req.body;
    console.log("otp : ", otp);
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log(user);
    console.log(user.otp);
    // Check if OTP exists and is valid
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (Date.now() > user.otpExpiry) {
      // await user.clearOTP();
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Update user details
    const hashPassword = await User.hashPassword(password);
    user.name = name;
    user.password = hashPassword;
    user.isVerified = true;
    user.authMethod = "email";
    // await user.clearOTP(); // Clear OTP after successful verification

    // Generate token
    const token = await user.generateAuthToken();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};
