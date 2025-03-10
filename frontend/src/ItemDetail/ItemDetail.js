import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { useCart } from "./CartContext";
import conf from "../conf/config";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(`${conf.urlPrefix}/api/items?filters[id][$eq]=${id}&populate=*`)
      .then((response) => {
        setProduct(response.data.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!item) {
    return (
      <div className="text-center text-red-500 text-2xl mt-10">
        สินค้าหมดแล้ว
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      setShowModal(true);
      return;
    }
    setLoading(true);
    await addToCart(item.id, selectedSize, selectedColor);
    setShowModal(true); // Show modal after adding to cart
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const colors = ["ดำ", "ขาว", "แดง", "น้ำเงิน"];
  const sizes = item?.size ? Object.entries(item.size) : [];

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white text-gray-900 rounded-lg shadow-xl p-6">
        <Link
          to="/products"
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-2" /> ย้อนกลับ
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <img
              src={`${conf.urlPrefix}${
                item.img?.formats?.small?.url ||
                item.img?.url ||
                "/placeholder.jpg"
              }`}
              alt={item.name}
              className="w-full aspect-square object-cover rounded-lg mb-4"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
            <p className="text-blue-600 text-2xl font-bold mt-4">
              {item.price} บาท
            </p>

            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-700">รายละเอียดสินค้า</h2>
              <p className={`text-gray-700 mt-2 ${showFullDescription ? "" : "line-clamp-3"}`}>
                {item.description}
              </p>
              {item.description && item.description.length > 100 && (
                <button
                  onClick={toggleDescription}
                  className="text-blue-600 hover:text-blue-800 mt-2"
                >
                  {showFullDescription ? "แสดงน้อยลง" : "แสดงเพิ่มเติม"}
                </button>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-700">ขนาด (Size)</h2>
              <div className="flex flex-col gap-2 mt-2">
                {sizes.map(([size, stock]) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={stock === 0}
                    className={`px-4 py-2 border rounded-lg flex justify-between items-center w-full ${
                      selectedSize === size
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700"
                    } hover:bg-blue-500 hover:text-white transition duration-300 ${stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span>{size}</span>
                    <span className="text-sm text-gray-500">{stock} ชิ้น</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-700">สี (Color)</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedColor === color
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700"
                    } hover:bg-blue-500 hover:text-white transition duration-300`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
              <FaShoppingCart className="mr-2" /> เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">เพิ่มลงตะกร้าสำเร็จ</h2>
            <p className="mb-4">สินค้าของคุณถูกเพิ่มลงในตะกร้าเรียบร้อยแล้ว</p>
            <button
              onClick={closeModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;