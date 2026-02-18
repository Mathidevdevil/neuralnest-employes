const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        // FIX: send role to backend
        const role =
            loginType === "admin"
                ? "Administrator"
                : "Employee";

        await login(email, password, role);

        navigate('/dashboard');

    } catch (err) {

        console.error(err);

        setError(
            err.response?.data?.message ||
            "Login failed"
        );
    }
};
