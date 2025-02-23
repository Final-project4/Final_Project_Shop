import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaStar, FaShoppingCart } from "react-icons/fa";
import Img1 from "../Picture/s1.png";
import Img2 from "../Picture/s2.png";
import Img3 from "../Picture/c1.png";
import Img4 from "../Picture/d2.png";
import Img5 from "../Picture/e2.png";
import Img6 from "../Picture/f2.png";
import Img7 from "../Picture/a2.png";
import Img8 from "../Picture/g2.png";

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

const ItemDetail = () => {
  const { id } = useParams();
  const product = ProductsData.find((item) => item.id === parseInt(id));

  if (!product) {
    return <div className="text-center text-red-500 text-2xl mt-10">สินค้าไม่พบ!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white text-gray-900 rounded-lg shadow-xl p-6">
        {/* Back button */}
        <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FaArrowLeft className="mr-2" /> ย้อนกลับ
        </Link>

        {/* Product Detail Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="flex-1">
            <img src={product.img} alt={product.title} className="w-full h-[300px] object-cover rounded-md shadow-md" />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
            <p className="text-yellow-500 flex items-center mt-2">
              <FaStar className="mr-1" /> {product.rating} / 5.0
            </p>
            <p className="text-gray-600 text-lg mt-2">สี: {product.color}</p>
            <p className="text-blue-600 text-2xl font-bold mt-4">{product.price} บาท</p>

            {/* Buy Button */}
            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              <FaShoppingCart className="mr-2" /> เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
