// ==========================
// IMPORT REQUIRED PACKAGES
// ==========================
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

// ==========================
// LOAD ENV VARIABLES
// ==========================
dotenv.config();

// ==========================
// CREATE EXPRESS APP
// ==========================
const app = express();

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());

// ==========================
// MONGODB CONNECTION
// ==========================
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI not found in environment variables");
  process.exit(1);
}

const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");

    db = client.db("neuralnest"); // your database name

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Connect to database
connectDB();


// ==========================
// ROOT ROUTE (TEST)
// ==========================
app.get("/", (req, res) => {
  res.send("NeuralNest Backend Running ✅");
});


// ==========================
// LOGIN ROUTE (ADMIN + EMPLOYEE)
// ==========================
app.post("/api/auth/login", async (req, res) => {
  try {

    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role required"
      });
    }

    // Find user in database
    const user = await db.collection("users").findOne({
      email: email,
      password: password,
      role: role
    });

    // If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Login failed"
      });
    }

    // Success
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ==========================
// SERVER START
// ==========================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
