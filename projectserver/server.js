require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const { readdirSync } = require("fs");
const cloudinary = require("cloudinary").v2;
// app
const app = express();
app.use(compression({ level: 6, threshold: 100 * 1000 }));
const http = require("http").createServer(app);
// const io = require("socket.io")(http);
// global._io  =  io;

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes middleware
readdirSync("./modules").map((r) => app.use("/api", require("./modules/" + r)));

// port
const port = process.env.PORT || 9090;
http.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${port}`);
});
