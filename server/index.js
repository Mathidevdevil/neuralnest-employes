const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let db;

// connect database
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("neuralnest");
    console.log("MongoDB Connected");
  }
}

// LOGIN API
app.post("/api/auth/login", async (req, res) => {

  await connectDB();

  const { email, password, role } = req.body;

  // check empty
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Email, password, and role required"
    });
  }

  const user = await db.collection("users").findOne({
    email: email,
    password: password,
    role: role
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Login failed"
    });
  }

  res.json({
    success: true,
    message: "Login success",
    user: user
  });

});

app.get("/", (req, res) => {
  res.send("Server working");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
