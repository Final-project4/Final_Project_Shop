import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import urlPrefix from "../conf/config";

const API_URL = `${urlPrefix}/api/coupons`; // URL ของ Strapi

const AddCoupons = () => {
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponName, setCouponName] = useState("");
  const [couponType, setCouponType] = useState("percentage");
  const [expirationDate, setExpirationDate] = useState("");
  const [coupons, setCoupons] = useState([]);

  const discountOptions = ["30% Off", "Free Shipping", "Buy 1 Get 1 Free", "20% Off"];

  // ✅ ดึงข้อมูลคูปองจาก Strapi เมื่อโหลดหน้าเว็บ
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && response.data.data) {
        setCoupons(response.data.data); // ใช้ response.data.data
      } else {
        setCoupons([]); // ตั้งค่าเป็น array ว่างหากไม่มีข้อมูล
        console.error("Invalid data structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]); // ตั้งค่าเป็น array ว่างหากเกิดข้อผิดพลาด
    }
  };

  // ✅ เพิ่มคูปองเข้า Strapi
  const addCoupon = async () => {
    if (selectedDiscount && couponCode && couponName && expirationDate) {
      try {
        const response = await axios.post(
          API_URL,
          {
            data: {
              code: couponCode,
              discount: parseInt(selectedDiscount.replace(/% Off/g, "")), // แปลงส่วนลดเป็นตัวเลข
              is_active: true,
              type: couponType,
              expiration_date: expirationDate,
              name: couponName,
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );

        // เพิ่มคูปองใหม่ลงใน state
        if (response.data && response.data.data) {
          setCoupons([...coupons, response.data.data]);
        }

        // รีเซ็ตฟิลด์ทั้งหมด
        setSelectedDiscount("");
        setCouponCode("");
        setCouponName("");
        setCouponType("percentage");
        setExpirationDate("");
      } catch (error) {
        console.error("Error adding coupon:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  // ✅ ลบคูปองจาก Strapi
  const removeCoupon = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCoupons(coupons.filter((coupon) => coupon.id !== id)); // อัปเดต state
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 justify-center items-center min-h-screen">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">Coupons</h2>

            {/* คูปองที่มีอยู่ */}
            <div className="flex flex-wrap gap-4 mb-6">
              {Array.isArray(coupons) && coupons.map((coupon) => (
                <div key={coupon.id} className="coupon-card bg-gray-100 p-4 rounded-md shadow-sm flex flex-col items-center justify-between w-48">
                  <h3 className="font-medium">{coupon.name || "No Name"}</h3>
                  <p>
                    <strong>{coupon.discount || "N/A"}</strong> off
                  </p>
                  <p>Code: <strong>{coupon.code || "N/A"}</strong></p>
                  <p>Type: <strong>{coupon.type || "N/A"}</strong></p>
                  <p>Expires: <strong>{coupon.expiration_date ? new Date(coupon.expiration_date).toLocaleDateString() : "N/A"}</strong></p>
                  <button
                    onClick={() => removeCoupon(coupon.id)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* เพิ่มคูปองใหม่ */}
            <div className="mt-6 bg-gray-200 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Add New Coupon</h3>

              {/* ชื่อคูปอง */}
              <input
                type="text"
                placeholder="Coupon Name"
                value={couponName}
                onChange={(e) => setCouponName(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
              />

              {/* เลือกส่วนลด */}
              <div className="relative w-full mb-3">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2 bg-white border rounded-md text-left"
                >
                  {selectedDiscount || "Select Discount"}
                </button>
                {isDropdownOpen && (
                  <ul className="absolute w-full bg-white border rounded-md mt-1 shadow-lg z-10">
                    {discountOptions.map((option) => (
                      <li
                        key={option}
                        onClick={() => {
                          setSelectedDiscount(option);
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* กรอกโค้ดคูปอง */}
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
              />

              {/* เลือกประเภทคูปอง */}
              <select
                value={couponType}
                onChange={(e) => setCouponType(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>

              {/* วันที่หมดอายุ */}
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
              />

              <button
                onClick={addCoupon}
                className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 w-full"
              >
                Add Coupon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoupons;