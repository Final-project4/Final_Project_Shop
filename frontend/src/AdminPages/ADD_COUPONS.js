import React, { useState } from "react";
import Sidebar from "./Sidebar";

const AddCoupons = () => {
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupons, setCoupons] = useState([
    { discount: "30% Off", code: "12357" },
    { discount: "Free Shipping", code: "ZLERP" },
  ]);

  const discountOptions = ["30% Off", "Free Shipping", "Buy 1 Get 1 Free", "20% Off"];

  const addCoupon = () => {
    if (selectedDiscount && couponCode) {
      setCoupons([...coupons, { discount: selectedDiscount, code: couponCode }]);
      setSelectedDiscount("");
      setCouponCode("");
    }
  };

  const removeCoupon = (code) => {
    setCoupons(coupons.filter((coupon) => coupon.code !== code));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Center Screen */}
      <div className="flex flex-1 justify-center items-center min-h-screen">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 border-2 rounded-full flex items-center justify-center text-lg font-bold">
              FS
            </div>
            <h1 className="text-3xl font-bold">
              <span className="text-[#daa520]">FASHION</span> SHOP
            </h1>
          </div>

          {/* Coupon Section */}
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">Coupons</h2>

            {/* Existing Coupons */}
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div key={coupon.code} className="flex justify-between bg-gray-100 p-3 rounded-md items-center">
                  <span className="font-medium">{coupon.discount}</span>
                  <span className="text-gray-700">Code: {coupon.code}</span>
                  <button 
                    onClick={() => removeCoupon(coupon.code)}
                    className="text-red-600 font-bold ml-4"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Coupon */}
            <div className="mt-6 bg-gray-200 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Add New Coupon</h3>
              
              {/* Dropdown for Discount Selection */}
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
              
              {/* Input for Coupon Code */}
              <input
                type="text"
                placeholder="Input code here"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
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
