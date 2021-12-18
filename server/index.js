require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

const authRouter = require("./routes/auth.js");
const postRouter = require("./routes/post.js");

var http = require("http");
// Bước 2: Khởi tạo server
var server = http.createServer(function (request, response) {
  // Thiết lập Header
  response.writeHead(200, {
    "Context-type": "text/htmlon",
  });
  response.end();
});
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-1.whueg.mongodb.net/mern-1?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();

app.use(express.json());
// app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});
