import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);

    function updateUserInfo(data) {
        setUserInfo(data);
    }

    return <AuthContext.Provider value={{ userInfo, updateUserInfo }}>{children}</AuthContext.Provider>;
}