import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // นำเข้า Sidebar component
import conf from "../conf/config";

const BASE_URL = conf.urlPrefix; // ใช้ HTTP ปกติ ไม่มี HTTPS ใน Localhost

const AdminItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/items?populate=*`);
        
        setItems(response.data.data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Error fetching items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="flex h-full w-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6 p-6 flex-1 overflow-auto">
        {loading ? (
          <p className="text-center col-span-3">กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className="text-center col-span-3 text-red-500">{error}</p>
        ) : items.length > 0 ? (
          items.map((item) => {
            const imageUrl = item.img?.url
              ? `${BASE_URL}${item.img.url}`
              : "/placeholder.jpg";

            return (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
              >
                {/* แสดงรูปสินค้า */}
                <img
                  src={imageUrl}
                  alt={item.name || "No Name"}
                  className="w-full h-48 object-cover rounded-md"
                />
                {/* ชื่อสินค้า */}
                <h3 className="text-lg font-semibold mt-3">
                  {item.name || "No Name"}
                </h3>
                {/* ราคา */}
                <p className="text-gray-600 mt-1">
                  ราคา: {item.price ? `${item.price} Baht` : "N/A Baht"}
                </p>
                {/* ปุ่ม Edit */}
                <button
                  onClick={() =>
                    navigate(`/admin/items/edit/${item.id}`)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-3">ไม่มีข้อมูลสินค้า</p>
        )}
      </div>
    </div>
  );
};

export default AdminItemList;
