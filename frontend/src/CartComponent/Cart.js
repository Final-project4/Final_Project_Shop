import React, { useEffect, useState, useContext } from 'react';
import { Trash2, Search, ShoppingCart, User } from "lucide-react"
import axios from "axios"
import Input from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import Checkbox from "../components/ui/checkbox"
import { AuthContext } from "../context/AuthContext"
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import CheckoutPopup from './CheckoutPopup';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';

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
  const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false)

  const [userAddress, setUserAddress] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal > 50 ? 0 : 4.99
  const total = subtotal + shippingFee

  const calculateTotal = () => {
    const subtotal = cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 50 ? 0 : 4.99;
    const total = subtotal + shippingFee - discountAmount;
    return total < 0 ? 0 : total;
  };

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

    // ตรวจสอบว่าคูปองที่เลือกคือ "เลือกคูปอง" หรือไม่
    if (selectedCoupon === "") {
      setDiscountAmount(0); // ยกเลิกการใช้งานคูปอง
    } else {
      // คำนวณจำนวนเงินที่ลดจากคูปอง
      const coupon = coupons.find(c => c.code === selectedCoupon);
      if (coupon) {
        if (coupon.discount_type === "Percentage") {
          const discount = (subtotal * coupon.discount_value) / 100;
          setDiscountAmount(discount);
        } else if (coupon.discount_type === "fixed_amount") {
          setDiscountAmount(coupon.discount_value);
        }
      } else {
        alert("คูปองไม่ถูกต้อง");
      }
    }
  };

  const handleProceedToCheckout = (e) => {
    e.preventDefault();
    setIsCheckoutButtonActive(true); // เปลี่ยนสีเมื่อคลิก
    setTimeout(() => setIsCheckoutButtonActive(false), 200); // คืนค่าเดิมหลังจาก 200ms
    setIsCheckoutPopupOpen(true); // เปิด popup
  };

  useEffect(() => {
    if (userInfo) {
      console.log("Fetching cart items for user:", userInfo.id);
      const fetchCartItems = async () => {
        console.log(userInfo)
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

  useEffect(() => {
    if (userInfo) {
      const fetchUserAddressAndCoupons = async () => {
        try {
          const token = Cookies.get("authToken");
          if (!token) {
            console.error("No authToken found");
            return;
          }
          // เรียก API เพื่อดึงข้อมูลที่อยู่ของผู้ใช้
          const addressResponse = await axios.get(`http://localhost:1337/api/users/${userInfo.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserAddress(addressResponse.data.address); // สมมติว่า address อยู่ใน response.data.address

          // เรียก API เพื่อดึงข้อมูลคูปองของผู้ใช้
          const couponsResponse = await axios.get(`http://localhost:1337/api/coupons?userId=${userInfo.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // ตรวจสอบว่าข้อมูลที่ได้รับเป็น array หรือไม่
          if (Array.isArray(couponsResponse.data.data)) {
            setCoupons(couponsResponse.data.data); // เข้าถึง data ของคูปอง
          } else {
            console.error("Coupons data is not an array:", couponsResponse.data);
            setCoupons([]); // ตั้งค่าเป็น array ว่างถ้าข้อมูลไม่ถูกต้อง
          }
        } catch (error) {
          console.error("Error fetching user address or coupons:", error);
        }
      };

      fetchUserAddressAndCoupons();
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
                        <CartItem 
                          key={item.id} 
                          item={item} 
                          updateQuantity={updateQuantity} 
                          removeItem={removeItem} 
                          toggleItemSelection={toggleItemSelection} 
                        />
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
          <OrderSummary 
            userAddress={userAddress}
            subtotal={subtotal}
            shippingFee={shippingFee}
            discountAmount={discountAmount}
            calculateTotal={calculateTotal}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            handleApplyVoucher={handleApplyVoucher}
            isApplyButtonActive={isApplyButtonActive}
            handleProceedToCheckout={handleProceedToCheckout}
            isCheckoutButtonActive={isCheckoutButtonActive}
          />
        </div>
      </div>
      {isCheckoutPopupOpen && (
        <CheckoutPopup
          items={cartItems.filter(item => item.selected)}
          total={calculateTotal()}
          discountAmount={discountAmount}
          onClose={() => setIsCheckoutPopupOpen(false)}
          cartItems={cartItems}
        />
      )}
    </div>
  )
}

export default Cart