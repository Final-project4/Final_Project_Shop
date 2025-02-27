import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // นำเข้า Sidebar component

const BASE_URL = "http://localhost:1337"; // ใช้ HTTP ปกติ ไม่มี HTTPS ใน Localhost

const ItemList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  console.log("Item Data:", items);
  useEffect(() => {
    axios.get(`${BASE_URL}/api/items?populate=*`)
      .then(response => {
        console.log("API Response:", response.data.data); // ตรวจสอบข้อมูล API
        setItems(response.data.data);
      })
      .catch(error => console.error("Error fetching items:", error));
  }, []);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6 p-6 flex-1 overflow-auto">
        {items.length > 0 ? (
          items.map((item) => {
            const imageUrl = item.img?.url 
  ? `http://localhost:1337${item.img.url}` 
  : "/placeholder.jpg";

            return (
              <div key={item.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                {/* แสดงรูปสินค้า */}
                <img src={imageUrl} alt={item.name || "No Name"} className="w-full h-48 object-cover rounded-md" />
                {/* ชื่อสินค้า */}
                <h3 className="text-lg font-semibold mt-3">{item.name || "No Name"}</h3>
                {/* ราคา */}
                <p className="text-gray-600 mt-1">ราคา: {item.price ? `${item.price} Baht` : "N/A Baht"}</p>
                {/* ปุ่ม Edit */}
                <button 
                  onClick={() => navigate(`/admin/items/edit/${item.documentId}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-3">กำลังโหลดข้อมูล...</p>
        )}
      </div>
    </div>
  );
};

export default ItemList;