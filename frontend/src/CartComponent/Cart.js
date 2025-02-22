import React, { useEffect, useState, useContext } from 'react';
import { Trash2, Search, ShoppingCart, User } from "lucide-react"
import axios from "axios"
import Input from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import Checkbox from "../components/ui/checkbox"
import { AuthContext } from "../context/AuthContext"
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Cart = () => {
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
  const [cartItems, setCartItems] = useState([])
  const [isApplyButtonActive, setIsApplyButtonActive] = useState(false);
  const [isCheckoutButtonActive, setIsCheckoutButtonActive] = useState(false);

  const [selectAll, setSelectAll] = useState(false)

  const subtotal = cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal > 50 ? 0 : 4.99
  const total = subtotal + shippingFee

  const updateQuantity = async (id, change) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    );

    const itemToUpdate = updatedItems.find(item => item.id === id);
    
    if (itemToUpdate) {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          console.error("No authToken found");
          return;
        }

        // เรียก API PUT เพื่ออัปเดตจำนวนสินค้า
        const response = await axios.put(`http://localhost:1337/api/cart-items/${itemToUpdate.item_cart_id}`, {
          amount: itemToUpdate.quantity // ส่งจำนวนที่อัปเดต
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ตรวจสอบสถานะการตอบกลับ
        if (response.status === 200) {
          setCartItems(updatedItems);
        } else {
          console.error("Failed to update item quantity:", response.data);
          alert("เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า กรุณาลองใหม่อีกครั้ง");
        }
      } catch (error) {
        console.error("Error updating item quantity:", error.response?.data || error);
        alert("เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const removeItem = async (itemCartId) => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No authToken found");
        return;
      }

      // เรียก API DELETE เพื่อลบสินค้า
      const response = await axios.delete(`http://localhost:1337/api/cart-items/${itemCartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ตรวจสอบสถานะการตอบกลับ
      if (response.status === 200 || response.status === 204) { // รองรับทั้ง 200 และ 204
        // ลบสินค้าใน state ทันที
        setCartItems(prevItems => prevItems.filter(item => item.item_cart_id !== itemCartId)); // ใช้ item_cart_id แทน id
      } else {
        console.error("Failed to remove item:", response.data);
        alert("เกิดข้อผิดพลาดในการลบสินค้า กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error removing item:", error.response?.data || error);
      console.error("Detailed error:", error); // เพิ่มการแสดงผลข้อผิดพลาดที่ละเอียดขึ้น
      console.error("API Response:", error.response); // แสดงข้อมูลที่ตอบกลับจาก API

      // แสดงข้อความแจ้งเตือนผู้ใช้เกี่ยวกับข้อผิดพลาด
      alert("เกิดข้อผิดพลาดในการลบสินค้า กรุณาลองใหม่อีกครั้ง");
    }
  };

  const removeSelectedItems = async () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert("กรุณาเลือกสินค้าอย่างน้อยหนึ่งชิ้นเพื่อลบ");
      return;
    }

    for (const item of selectedItems) {
      await removeItem(item.item_cart_id);
    }
  };

  const toggleItemSelection = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ))
    // เช็คว่าหลังจากเลือกสินค้าแล้ว ทุกชิ้นถูกเลือกหรือไม่
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    )
    const allSelected = updatedItems.every(item => item.selected)
    setSelectAll(allSelected)
  }

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setCartItems(cartItems.map(item => ({ ...item, selected: newSelectAll })))
  }

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    setIsApplyButtonActive(true); // เปลี่ยนสีเมื่อคลิก
    setTimeout(() => setIsApplyButtonActive(false), 200); // คืนค่าเดิมหลังจาก 200ms
    console.log('Apply voucher clicked');
  };

  const handleProceedToCheckout = (e) => {
    e.preventDefault();
    setIsCheckoutButtonActive(true); // เปลี่ยนสีเมื่อคลิก
    setTimeout(() => setIsCheckoutButtonActive(false), 200); // คืนค่าเดิมหลังจาก 200ms
    console.log('Proceed to checkout clicked');
  };

  useEffect(() => {
    if (userInfo) {
      console.log("Fetching cart items for user:", userInfo.id);
      const fetchCartItems = async () => {
        try {
          const token = Cookies.get("authToken");
          if (!token) {
            console.error("No authToken found");
            return;
          }
          const response = await axios.get(
            `http://localhost:1337/api/carts?filters[user][id][$eq]=${userInfo.id}&populate=cart_items.item.img`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("API Response:", response.data);

          // ตรวจสอบโครงสร้างของข้อมูล
          if (response.data.data && Array.isArray(response.data.data)) {
            const items = response.data.data.flatMap(cart => 
              cart.cart_items && Array.isArray(cart.cart_items) ? 
                cart.cart_items.map(cartItem => ({
                  ...cartItem.item, // ดึงข้อมูลจาก item
                  quantity: cartItem.amount, // ใช้ amount เป็น quantity
                  selected: false, // เพิ่มค่าเริ่มต้นสำหรับ selected
                  item_cart_id: cartItem.id // เพิ่ม item_cart_id ที่ตรงกับ id ของ cartItem
                })) : []
            );
            console.log("Fetched items:", items); // ตรวจสอบข้อมูลผลิตภัณฑ์ที่ดึงมา
            setCartItems(items);
          } else {
            console.error("Invalid data structure:", response.data);
          }
        } catch (error) {
          console.error("Error fetching cart items:", error.response?.data || error);
        }
      };

      fetchCartItems();
    } else {
      console.log("No user info available to fetch cart items");
    }
  }, [userInfo]);

  return (
    <div className="min-h-screen bg-white">
      {/* Logo */}
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-6">
            <img
              src="/fs-logo.png"
              alt="Fashion Shop Logo"
              className="w-24 h-24"
            />
            <div className="text-5xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              <span style={{ color: '#C8A36E', opacity: '0.85' }}>FASHION</span>
              <span className="text-gray-800"> SHOP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto pb-16" style={{ marginTop: '4rem', transform: 'translateX(5rem)' }}>
        <div className="flex flex-col lg:flex-row gap-16 justify-between">
          {/* Cart Items */}
          <div style={{ width: '760px', flexShrink: 0 }}>
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Checkbox id="select-all" checked={selectAll} onChange={toggleSelectAll} />
                    <label htmlFor="select-all" className="text-lg">Select all</label>
                  </div>
                  <Trash2
                    size={24}
                    className="text-gray-400 cursor-pointer"
                    onClick={removeSelectedItems}
                  />
                </div>

                <div className="h-[400px] border-t overflow-y-auto">
                  {cartItems.length > 0 ? (
                    <div className="divide-y h-full">
                      {cartItems.map((item) => (
                        <div key={item.id} className="bg-gray-100 p-10 rounded-lg mb-4">
                          <div className="flex items-center py-6 w-full gap-6">
                            {/* Checkbox */}
                            <Checkbox
                              checked={item.selected}
                              onChange={() => toggleItemSelection(item.id)}
                            />

                            {/* Product Image */}
                            <div className="w-24 h-24 flex-shrink-0">
                              <img
                                src={`http://localhost:1337${
                                  item.img?.formats?.small?.url ||
                                  item.img?.url ||
                                  "/placeholder.jpg"}`}
                                alt={item.name || "Product Image"}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-lg truncate">{item.name || "Unknown Product"}</h3>
                              <p className="text-sm text-gray-500 mt-2">${(item.price * item.quantity || 0).toFixed(2)}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border rounded">
                                <button
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-lg"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  -
                                </button>
                                <span className="w-12 text-center text-lg">{item.quantity}</span>
                                <button
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-lg"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  +
                                </button>
                              </div>
                              <Trash2
                                size={20}
                                className="text-gray-400 cursor-pointer hover:text-gray-600"
                                onClick={() => removeItem(item.item_cart_id)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full pt-32">
                      <div className="text-center text-gray-500">
                        <ShoppingCart size={48} className="mx-auto mb-4" />
                        <p className="text-lg">Your cart is empty</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[300px]" style={{ transform: 'translateX(-11rem)' }}>
            <Card className="bg-gray-50 sticky top-4">
              <CardContent className="p-8">
                <div className="bg-gray-100 p-6 rounded-lg space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-lg">Location</span>
                    <span className="text-lg">.....</span>
                  </div>

                  <div>
                    <h2 className="font-medium text-xl mb-6">Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Subtotal({cartItems.length} items)</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Shipping Fee</span>
                        <span>${shippingFee.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Input
                      placeholder="  Enter Voucher Code"
                      className="flex-1 bg-white border border-gray-200 py-3 text-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleApplyVoucher(e)}
                      style={{
                        backgroundColor: isApplyButtonActive ? '#8B4513' : '#DAA520', // เปลี่ยนสีเมื่อคลิก
                        opacity: '0.45',
                      }}
                      className="text-white px-8 py-3 rounded-lg font-medium text-lg shadow-lg transition-colors duration-200 cursor-pointer"
                    >
                      APPLY
                    </button>
                  </div>

                  <div className="flex justify-between font-medium text-xl">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleProceedToCheckout(e)}
                    style={{
                      backgroundColor: isCheckoutButtonActive ? '#800000' : '#AF2C02', // เปลี่ยนสีเมื่อคลิก
                    }}
                    className="w-full text-white py-4 rounded-lg font-medium text-lg shadow-lg transition-colors duration-200 cursor-pointer"
                  >
                    PROCEED TO CHECKOUT ({cartItems.filter(item => item.selected).length})
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart