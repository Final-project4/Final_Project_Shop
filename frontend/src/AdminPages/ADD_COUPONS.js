import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import conf from "../conf/config";

const API_URL = `${conf.urlPrefix}/api/coupons`; // URL ของ Strapi

const AddCoupons = () => {
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [coupons, setCoupons] = useState([]);
 

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && response.data.data) {
        setCoupons(response.data.data);
      } else {
        setCoupons([]);
        console.error("Invalid data structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]);
    }
  };

  const addCoupon = async () => {
    if (!couponCode || !discountValue || !validFrom || !validUntil) {
        alert("Please fill in all required fields.");
        return;
    }
    try {
        const response = await axios.post(
            API_URL,
            {
                data: {
                    code: couponCode,
                    discount_type: discountType === "Percentage" ? "Percentage" : "Free Shipping",
                    discount_value: parseFloat(discountValue),
                    minimum_order: parseFloat(minimumOrder) || 0,
                    max_discount: parseFloat(maxDiscount) || 0,
                    valid_from: validFrom,
                    valid_until: validUntil,
                    is_active: isActive,
                },
            },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("API Response:", response.data);

        if (response.data && response.data.data) {
            setCoupons([...coupons, response.data.data]);
        }

        // รีเซ็ตค่าในฟอร์ม
        setCouponCode("");
        setDiscountType("Percentage");
        setDiscountValue("");
        setMinimumOrder("");
        setMaxDiscount("");
        setValidFrom("");
        setValidUntil("");
        setIsActive(true);
    } catch (error) {
        console.error("Error adding coupon:", error);
        console.log("Server response:", error.response?.data);
    }
};

const removeCoupon = async (documentId) => {
  try {
      await axios.delete(`${API_URL}/${documentId}`);
      setCoupons(coupons.filter((coupon) => coupon.id !== documentId));
  } catch (error) {
      console.error("Error deleting coupon:", error);
  }
};

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 justify-center items-center min-h-screen">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4 text-center">Manage Coupons</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            {coupons?.map((coupon) => (
              <div>
              <h3>Code: {coupon.code}</h3>
              <p>Discount: {coupon.discount_value}%</p>
              <p>Valid From: {new Date(coupon.valid_from).toLocaleDateString()}</p>
              <p>Valid Until: {new Date(coupon.valid_until).toLocaleDateString()}</p>
              <button
                  onClick={() => removeCoupon(coupon.documentId)}
                  className="bg-red-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
            </div>
            ))}
          </div>

          <div className="bg-gray-200 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Add New Coupon</h3>
            <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full p-2 border rounded-md mb-3" />
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full p-2 border rounded-md mb-3">
              <option value="percentage">Percentage</option>
              <option value="free_shipping">Free Shipping</option>
            </select>
            <input type="number" placeholder="Discount Value" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full p-2 border rounded-md mb-3" />
            <input type="number" placeholder="Minimum Order" value={minimumOrder} onChange={(e) => setMinimumOrder(e.target.value)} className="w-full p-2 border rounded-md mb-3" />
            <input type="number" placeholder="Max Discount" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} className="w-full p-2 border rounded-md mb-3" />
            <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className="w-full p-2 border rounded-md mb-3" />
            <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full p-2 border rounded-md mb-3" />
            <button onClick={addCoupon} className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 w-full">Add Coupon</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoupons;