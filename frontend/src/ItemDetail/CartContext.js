import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getAuthToken } from "../context/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const { userInfo } = useAuth();

  const fetchUserCart = async (userId) => {
    try {
      const authToken = getAuthToken();
      const response = await axios.get("http://localhost:1337/api/carts", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          "filters[user][id][$eq]": userId,
          populate: "*",
        },
        withCredentials: true,
      });

      if (response.data.data.length === 0) {
        console.log("ไม่มีตะกร้าสำหรับผู้ใช้นี้");
        return null;
      } else {
        return response.data.data[0];
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงตะกร้า:", error);
      return null;
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchUserCart(userInfo.id).then((userCart) => setCart(userCart));
    }
  }, [userInfo]);

  const addToCart = async (productId, size, color) => {
    if (!userInfo) {
      alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า");
      return;
    }

    try {
      const authToken = getAuthToken();
      const cartId = cart ? cart.id : null;
      const response = await axios.post(
        "http://localhost:1337/api/cart-items",
        {
          data: {
            cart: cartId,
            item: productId,
            // size,
            // color,
            amount: 1,  
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );

      console.log("เพิ่มสินค้าลงตะกร้าสำเร็จ", response.data);
      fetchUserCart(userInfo.id).then((updatedCart) => setCart(updatedCart));
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้าไปยังตะกร้า:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, userInfo }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
