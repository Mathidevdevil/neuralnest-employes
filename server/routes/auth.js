const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        console.log("Login request:", email, role);

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, password and role required"
            });
        }

        const db = mongoose.connection.db;

        const user = await db.collection("users").findOne({
            email: email,
            password: password,
            role: role
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email, password or role"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: user
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;
