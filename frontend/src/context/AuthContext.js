import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = Cookies.get("authToken");
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
    } catch (error) {
      console.error("Error fetching user:", error);
      Cookies.remove("authToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token) => {
    Cookies.set("authToken", token, { expires: 7, secure: true });
    setLoading(true);
    fetchUser(); // ✅ สามารถเรียกใช้ fetchUser() ได้
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role?.name === "Administrator", loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
