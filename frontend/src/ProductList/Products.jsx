import React, { useState } from "react";
import Img1 from "/Users/zlannoysg/Desktop/ZLannoysG/Final_Project_Shop/frontend/src/Picture/s1.png";
import Img2 from "/Users/zlannoysg/Desktop/ZLannoysG/Final_Project_Shop/frontend/src/Picture/s2.png";
import Img3 from "/Users/zlannoysg/Desktop/ZLannoysG/Final_Project_Shop/frontend/src/Picture/c1.png";
import Img4 from "/Users/zlannoysg/Desktop/ZLannoysG/Final_Project_Shop/frontend/src/Picture/d2.png";
import Img5 from "/Users/zlannoysg/Desktop/ZLannoysG/Final_Project_Shop/frontend/src/Picture/e2.png";
import Img6 from "/Users/zlannoysg/Desktop/ZLannoysG/Final_Project_Shop/frontend/src/Picture/f2.png";
import Img7 from "/Users/zlannoysg/Desktop/ZLannoysG/Final_Project_Shop/frontend/src/Picture/a2.png";
import Img8 from "/Users/zlannoysg/Desktop/ZLannoysG/Final_Project_Shop/frontend/src/Picture/g2.png";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ProductsData = [
  { id: 1, img: Img1, title: "เสื้อสีขาว", rating: 5.0, price: "฿250", category: "ชุดเดรส" },
  { id: 2, img: Img2, title: "เสื้อสีดำ", rating: 5.0, price: "฿300", category: "ชุดเดรส" },
  { id: 3, img: Img3, title: "เสื้อสีเทา", rating: 4.8, price: "฿280", category: "หมวก" },
  { id: 4, img: Img4, title: "เสื้อสีน้ำเงิน", rating: 4.9, price: "฿320", category: "ชุดเดรส" },
  { id: 5, img: Img5, title: "เสื้อสีขาว", rating: 5.0, price: "฿250", category: "รองเท้า" },
  { id: 6, img: Img6, title: "เสื้อสีดำ", rating: 5.0, price: "฿300", category: "แว่นตา" },
  { id: 7, img: Img7, title: "เสื้อสีเทา", rating: 4.8, price: "฿280", category: "นาฬิกา" },
  { id: 8, img: Img8, title: "เสื้อสีน้ำเงิน", rating: 4.9, price: "฿320", category: "คอสเพลย์" },
];

const categories = ["นาฬิกา", "หมวก", "ชุดเดรส", "รองเท้า", "แว่นตา", "คอสเพลย์"];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("ชุดเดรส");

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      {/* OUR PRODUCT */}
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-16 px-8">
  {/* OUR PRODUCT */}
  <div className="text-center mb-10">
    <h1 className="text-5xl font-extrabold text-gray-800 tracking-wide uppercase relative inline-block">
      SHOPPING
      <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-orange-500 rounded-full"></span>
    </h1>
    <p className="text-xl text-gray-700 mt-4 italic">
      ✨ เลือกสินค้าตามหมวดหมู่ที่คุณชื่นชอบ ✨
    </p>
    <div className="mt-6 flex justify-center">
      <div className="w-16 h-1 bg-orange-400 rounded-full mx-1"></div>
      <div className="w-10 h-1 bg-orange-300 rounded-full mx-1"></div>
      <div className="w-6 h-1 bg-orange-200 rounded-full mx-1"></div>
    </div>
  </div>
</div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 mb-6 bg-gray-200 p-3 rounded-lg shadow-md">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all 
              ${selectedCategory === category ? "bg-orange-500 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-300"}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Display */}
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {ProductsData.filter((item) => item.category === selectedCategory).map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform">
              <img src={item.img} alt={item.title} className="h-[180px] w-full object-cover" />
              <div className="p-4">
                <h2 className="text-gray-800 font-semibold text-lg">{item.title}</h2>
                <p className="flex items-center text-yellow-500 text-sm mt-1">
                  <FaStar className="mr-1" /> {item.rating}
                </p>
                <p className="text-red-500 font-bold mt-2">{item.price}</p>
                <Link to={`/product/${item.id}`}>
                  <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg">ดูรายละเอียด</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
