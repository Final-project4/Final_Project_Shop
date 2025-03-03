import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import urlPrefix from "../conf/config";
// ตั้งค่าการเลื่อนแบบ Smooth
const sliderSettings = {
  infinite: true,
  speed: 4000, // เลื่อน Smooth
  slidesToShow: 3, // แสดง 3 ชิ้นต่อแถว
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 500, // ทุก 3 วิ
  arrows: true, // มีปุ่มลูกศร
  dots: true, // แสดง Indicator จุดข้างล่าง
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2, // Tablet แสดง 2 ชิ้น
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1, // มือถือแสดง 1 ชิ้น
      },
    },
  ],
};

const PopularProducts = ({ products }) => {
  return (
    <section className="container mx-auto px-4 text-center">
      <h2 className="text-2xl italic">🔥 Popular Products</h2>
      <Slider {...sliderSettings} className="mt-40 h-30">
        {products.map((product) => (
          <div key={product.id} className="p-4">
            <div className="bg-white p-4 shadow-lg rounded-lg flex flex-col justify-between min-h-[24rem] transition-transform transform hover:scale-105 hover:shadow-2xl">
              {/* รูปสินค้า */}
              <div className="w-full relative" style={{ paddingTop: "100%" }}>
                <img
                  src={`${urlPrefix}${
                    product.img?.formats?.small?.url ||
                    product.img?.url ||
                    "/placeholder.jpg"
                  }`}
                  alt={product.name || "No Name"}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-200"
                />
              </div>

              {/* ข้อมูลสินค้า */}
              <div className="flex flex-col flex-grow justify-between">
                <p className="mt-4 font-medium text-lg text-gray-800 line-clamp-1">
                  {product.name || "No Name"}
                </p>
                <p className="text-gray-600">{product.price ?? "N/A"} บาท</p>

                {/* ปุ่มสั่งซื้อ */}
                <Link to={`/product/${product.id}`}>
                  <button className="mt-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:from-purple-600 hover:to-blue-600 transition transform hover:scale-110">
                    🛍 สั่งซื้อ
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default PopularProducts;
