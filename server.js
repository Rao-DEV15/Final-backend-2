require('dotenv').config();

const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Allow both local and deployed frontends
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://stock-ease-five.vercel.app"
  ]
}));

app.use(express.json());

app.post("/delete-image", async (req, res) => {
  const { public_id } = req.body;
  console.log("Received PI:", public_id);

  try {
    await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("Cloudinary delete error", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

