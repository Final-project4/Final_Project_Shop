import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("authToken");

  const fetchUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:1337/api/users/me?populate=*", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUser(userData);
      console.log("userres",userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null); // Reset user state to null on error
      Cookies.remove("authToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const login = async (token, userData) => {
    Cookies.set("authToken", token, { expires: 7, secure: true });
    setUser(userData); 
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("authToken");
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, isAdmin: userInfo?.role?.name === "Admin", loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
