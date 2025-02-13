import React from "react";
import Sidebar from "./Sidebar";

const AddCoupons = () => {
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
              <div className="flex justify-between bg-gray-100 p-3 rounded-md">
                <span className="font-medium">30% Off</span>
                <span className="text-gray-700">Code: 12357</span>
              </div>
              <div className="flex justify-between bg-gray-100 p-3 rounded-md">
                <span className="font-medium">Free Shipping</span>
                <span className="text-gray-700">Code: ZLERP</span>
              </div>
            </div>

            {/* Add New Coupon */}
            <div className="mt-6 bg-gray-200 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Add New Coupon</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Insert coupon here"
                  className="w-2/3 p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Input code here"
                  className="w-1/3 p-2 border rounded-md"
                />
              </div>
              <button className="mt-3 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 w-full">
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
