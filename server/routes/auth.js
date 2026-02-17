const User = require('../models/User');

exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find user in MongoDB
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Login success
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }

};
