import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";


const ItemDetail = () => {
  const { id } = useParams();
  const [item, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [userCartId, setUserCartId] = useState(null);
  const [userInfo, setUserInfo] = useState(() => {
  const token = Cookies.get("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  });
  useEffect(() => {
    axios
      .get(`http://localhost:1337/api/items?filters[id][$eq]=${id}&populate=*`)
      .then((response) => {
        console.log("API Response:", response.data);
        setProduct(response.data.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
    console.log("User Info:", userInfo);  // ตรวจสอบข้อมูลผู้ใช้
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      // ใช้ API เพื่อดึงข้อมูล cart ของผู้ใช้
      axios
        .get("http://localhost:1337/api/users/me?populate=cart", {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` }
        })
        .then((response) => {
          console.log("User cart:", response.data.cart);
          if (response.data.cart) {
            setUserCartId(response.data.cart.id);  // ตั้งค่าค่า cart id
          } else {
            console.warn("User does not have a cart");
          }
        })
        .catch((error) => {
          console.error("Error fetching user cart:", error);
        });
    }
  }, [userInfo]);


  if (!item) {
    return <div className="text-center text-red-500 text-2xl mt-10">สินค้าไม่พบ!</div>;
  }


  const sizes = ["S", "M", "L", "XL", "2XL"];
  const colors = ["ดำ", "ขาว", "แดง", "น้ำเงิน"];

  const handleAddToCart = () => {
    if (!userCartId) {
      console.error("ฮาคไก่ไม่พบตะกร้าของผู้ใช้");
      alert("ไม่สามารถเพิ่มสินค้าลง");
      return;
    }

    const cartItem = {
      amount: 1,
      cart: userCartId,
      item: item.id,
    };
    console.log("Adding item to cart:", cartItem);
    axios
      .post("http://localhost:1337/api/cart-items", cartItem)
      .then((response) => {
        console.log("Item added to cart:", response.data);
        alert("เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว!");
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
        alert("เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า");
      });
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white text-gray-900 rounded-lg shadow-xl p-6">
        <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FaArrowLeft className="mr-2" /> ย้อนกลับ
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <img
              src={`http://localhost:1337${item.img?.formats?.small?.url || item.img?.url || "/placeholder.jpg"
                }`}
              alt={item.name}
              className="w-full aspect-square object-cover rounded-lg mb-4"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
            <p className="text-blue-600 text-2xl font-bold mt-4">{item.price} บาท</p>

            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-700">รายละเอียดสินค้า (Description)</h2>
              <p className="text-gray-700 mt-2">
                {showFullDescription || item.description.length <= 200
                  ? item.description
                  : item.description.slice(0, 200) + ""}
              </p>
              {item.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 hover:underline mt-1"
                >
                  {showFullDescription ? "ย่อข้อความ" : "อ่านเพิ่มเติม"}
                </button>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-700">ขนาด (Size)</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg ${selectedSize === size ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                      } hover:bg-blue-500 hover:text-white transition duration-300`}
                  >
                    {size}
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
                    className={`px-4 py-2 border rounded-lg ${selectedColor === color ? "bg-blue-500 text-white" : "bg-white text-gray-700"
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
    </div>
  );
};

export default ItemDetail;