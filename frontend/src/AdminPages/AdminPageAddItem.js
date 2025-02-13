import React from "react";
import Sidebar from "./Sidebar";
const AdminPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar /> {/*ใช้ sidebar /*}

      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col items-center">
        {/* Title */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 border-2 rounded-full flex items-center justify-center text-lg font-bold">
            FS
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-[#daa520]">FASHION</span> SHOP
          </h1>
        </div>

        {/* Content Box */}
        <div className="bg-white p-10 rounded-lg shadow-lg flex space-x-10">
          {/* Image Upload Section */}
          <div className="relative w-40 md:w-64 bg-gray-200 rounded-lg flex items-center justify-center">
            {/* ปุ่มเลื่อนซ้าย */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              ◀
            </button>

            {/* ปุ่มกดเพิ่มรูป */}
            <div className="text-4xl text-gray-500 cursor-pointer">+</div>

            {/* ปุ่มเลื่อนขวา */}
            <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              ▶
            </button>
          </div>

          {/* Form Section */}
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="name"
              className="p-3 w-72 border border-gray-300 rounded-md bg-[#f7ead1] text-gray-700"
            />
            <textarea
              placeholder="description"
              className="p-3 w-72 h-24 border border-gray-300 rounded-md bg-[#f7ead1] text-gray-700"
            ></textarea>

            {/* ปุ่มเพิ่มข้อมูล */}
            <button className="px-4 py-2 bg-gray-300 rounded-md text-lg">+</button>

            {/* ปุ่ม ADD */}
            <button className="px-6 py-3 bg-[#daa520] text-black font-bold rounded-lg shadow-md hover:bg-yellow-600 transition">
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
