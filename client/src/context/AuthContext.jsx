import React, {
    createContext,
    useContext,
    useState
} from "react";

import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const login = async (email, password, role) => {

        const res = await axios.post(
            "https://neuralnest-backend.onrender.com/api/auth/login",
            {
                email: email,
                password: password,
                role: role
            }
        );

        setUser(res.data.user);

        return res.data;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);
