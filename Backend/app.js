const express = require("express");
const cookieParser = require("cookie-parser"); // Add this import
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const userRoutes = require("./routes/user.route");
const dbConnect = require("./db/db");
app.get("/", (req, res) => {
  return res.send("Hello World!");
});
dbConnect();
// Enable user routes
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
