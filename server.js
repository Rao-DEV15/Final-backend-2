require('dotenv').config();


const express = require("express");
const path = require("path");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// ✅ This is missing in your current code:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("ENV CHECK:", {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// ✅ Replace default cors() with custom setup
const allowedOrigins = [
  "http://localhost:3000",          // Local dev
  "https://stock-ease.netlify.app"  // Netlify deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Parse JSON and URL-encoded data
app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: true }));



app.post("/delete-image", async (req, res) => {
  const { public_id } = req.body;
  console.log("Received public_id:", public_id);

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: "Deleted", result });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
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
