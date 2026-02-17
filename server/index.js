const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let db;

client.connect().then(() => {

    db = client.db("neuralnest");

    console.log("MongoDB connected");

});

app.post("/api/auth/login", async (req, res) => {

    try {

        const { email, password, role } = req.body;

        if (!email || !password || !role) {

            return res.status(400).json({
                message:
                    "Email, password, and role required"
            });

        }

        const user =
            await db
                .collection("users")
                .findOne({
                    email: email,
                    password: password,
                    role: role
                });

        if (!user) {

            return res.status(401).json({
                message: "Login failed"
            });

        }

        res.json({
            message: "Login success",
            user: user
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

});

app.listen(10000, () =>
    console.log("Server running")
);
