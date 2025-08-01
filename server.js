
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ url: req.file.path });
});

app.get("/", (req, res) => {
  res.send("Cloudinary upload server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
