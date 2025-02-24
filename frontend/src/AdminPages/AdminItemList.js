import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:1337"; // ใช้ HTTP ปกติ ไม่มี HTTPS ใน Localhost

const ItemList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/api/items?populate=*`)
      .then(response => {
        console.log("API Response:", response.data.data); // ตรวจสอบข้อมูล API
        setItems(response.data.data);
      })
      .catch(error => console.error("Error fetching items:", error));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {items.length > 0 ? (
        items.map((item) => {
          const imageUrl = item.img && item.img.length > 0 
            ? `${BASE_URL}${item.img[0].url}` 
            : "/default-image.jpg"; // ถ้าไม่มีรูปใช้ default image

          return (
            <div key={item.id} className="card">
              {/* แสดงรูปสินค้า */}
              <img src={imageUrl} alt={item.name || "No Name"} />
              {/* ชื่อสินค้า */}
              <h3>{item.name || "No Name"}</h3>
              {/* ราคา */}
              <p>ราคา: {item.price ? `${item.price} Baht` : "N/A Baht"}</p>
            </div>
          );
        })
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
};

export default ItemList;
