import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // Fetch the user information with populated cart
      axios.get('http://localhost:1337/api/users/me?populate=*', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        // Handle token expiration or invalid token
        Cookies.remove('token');
      });
    }
  }, []);

  function updateUserInfo(data) {
    setUserInfo(data);
  }

  return <AuthContext.Provider value={{ userInfo, updateUserInfo }}>{children}</AuthContext.Provider>;
}