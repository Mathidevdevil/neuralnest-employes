app.post("/api/auth/login", async (req, res) => {
  try {

    const { email, password, role } = req.body;

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
      message: "Login successful",
      user: user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
