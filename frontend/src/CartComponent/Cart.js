import React, { useEffect, useState,  } from "react";
import { Trash2, ShoppingCart,  } from "lucide-react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import Checkbox from "../components/ui/checkbox";
import Cookies from "js-cookie";
import CheckoutPopup from "./CheckoutPopup";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import { useAuth } from "../context/AuthContext";
import conf from "../conf/config";

const Cart = () => {
  const { userInfo, setUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isApplyButtonActive, setIsApplyButtonActive] = useState(false);
  const [isCheckoutButtonActive, setIsCheckoutButtonActive] = useState(false);
  const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = cartItems
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + shippingFee;

  const calculateTotal = () => {
    const subtotal = cartItems
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 500 ? 0 : 40;
    const total = subtotal + shippingFee - discountAmount;
    // console.log("taotat",total)
    return total < 0 ? 0 : total;
  };

  const updateQuantity = async (id, change) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );

    const itemToUpdate = updatedItems.find((item) => item.id === id);

    if (itemToUpdate) {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          console.error("No authToken found");
          return;
        }

        // เรียก API PUT เพื่ออัปเดตจำนวนสินค้า
        const response = await axios.put(
          `${conf.urlPrefix}/api/cart-items/${itemToUpdate.item_cart_id}`,
          {
            amount: itemToUpdate.quantity, // ส่งจำนวนที่อัปเดต
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ตรวจสอบสถานะการตอบกลับ
        if (response.status === 200) {
          setCartItems(updatedItems);
        } else {
          console.error("Failed to update item quantity:", response.data);
          alert("เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า กรุณาลองใหม่อีกครั้ง");
        }
      } catch (error) {
        console.error(
          "Error updating item quantity:",
          error.response?.data || error
        );
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
      const response = await axios.delete(
        `${conf.urlPrefix}/api/cart-items/${itemCartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ตรวจสอบสถานะการตอบกลับ
      if (response.status === 200 || response.status === 204) {
        // รองรับทั้ง 200 และ 204
        // ลบสินค้าใน state ทันที
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.item_cart_id !== itemCartId)
        ); // ใช้ item_cart_id แทน id
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
  const removeUsedVoucher = async (couponCode) => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No authToken found");
        return;
      }

      // ส่ง request ไปยัง API เพื่อลบ voucher ที่ใช้แล้ว
      const response = await axios.put(
        `${conf.urlPrefix}/api/users/${userInfo.id}?populate=*`,
        {
          coupons: userInfo.coupons.filter(
            (coupon) => coupon.code !== couponCode
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Voucher removed successfully");
        // อัปเดตข้อมูลผู้ใช้ใน state
        setUser((prevUserInfo) => ({
          ...prevUserInfo,
          coupons: prevUserInfo.coupons.filter(
            (coupon) => coupon.code !== couponCode
          ),
        }));
      } else {
        console.error("Failed to remove voucher:", response.data);
      }
    } catch (error) {
      console.error("Error removing voucher:", error.response?.data || error);
    }
  };

  const handleCheckout = async (slipFile) => {
    if (!userInfo) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
      return;
    }

    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      alert("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น");
      return;
    }
    
    try {
      const token = Cookies.get("authToken");

      // สร้างออเดอร์ใหม่
      const orderResponse = await axios.post(
        `${conf.urlPrefix}/api/orders`,
        {
          data: {
            user: userInfo.id,
            total_price: selectedItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
            step: "pending",
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderId = orderResponse.data.data.id;
      console.log(selectedItems)
      // สร้าง order items
      await Promise.all(
        selectedItems.map((cartItem) =>
          axios.post(
            `${conf.urlPrefix}/api/order-items`,
            {
              data: {
                quantity: cartItem.quantity,
                price: cartItem.price,
                size: cartItem.size,
                color: cartItem.color,
                order: orderId,
                cart_item: cartItem.item_cart_id,
              },
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );

      // อัปโหลดสลิปการชำระเงิน (ถ้ามี)
      let slipFileId = null;
      if (slipFile) {
        const formData = new FormData();
        formData.append("files", slipFile);

        const uploadResponse = await axios.post(
          `${conf.urlPrefix}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (uploadResponse.data.length > 0) {
          slipFileId = uploadResponse.data[0].id;
        }
      }

      // อัปเดตออเดอร์ด้วยสลิป (ถ้ามี)
      if (slipFileId) {
        await axios.put(
          `${conf.urlPrefix}/api/orders/${orderId}`,
          {
            data: {
              slip: slipFileId,
            },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // ลบสินค้าออกจากตะกร้า
      await Promise.all(
        selectedItems.map((item) =>
          axios.delete(
            `${conf.urlPrefix}/api/cart-items/${item.item_cart_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );
      if (selectedCoupon) {
        await removeUsedVoucher(selectedCoupon);
      }
      alert("ชำระเงินสำเร็จ กำลังอยู่ระหว่างรอดำเนินการ");
      // อัปเดต state และปิด popup
      fetchCartItems();
      setIsCheckoutPopupOpen(false);
      setCartItems([]);
    } catch (error) {
      console.error(
        "Error processing checkout:",
        error.response?.data || error
      );
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // Function to fetch cart items
  const fetchCartItems = async () => {
    if (userInfo) {
      console.log("Fetching cart items for user:", userInfo.id);
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          console.error("No authToken found");
          return;
        }
        const response = await axios.get(
          `${conf.urlPrefix}/api/carts?filters[user][id][$eq]=${userInfo.id}&populate=cart_items.item.img`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API Response:", response.data);

        if (response.data.data && Array.isArray(response.data.data)) {
          const items = response.data.data.flatMap((cart) =>
            cart.cart_items && Array.isArray(cart.cart_items)
              ? cart.cart_items.map((cartItem) => ({
                  ...cartItem.item,
                  quantity: cartItem.amount,
                  selected: false,
                  item_cart_id: cartItem.id,
                  size: cartItem.size,
                  color: cartItem.color,
                }))
              : []
          );
          console.log("Fetched items:", items); // ตรวจสอบข้อมูล
          setCartItems(items);
        } else {
          console.error("Invalid data structure:", response.data);
        }
      } catch (error) {
        console.error(
          "Error fetching cart items:",
          error.response?.data || error
        );
      }
    } else {
      console.log("No user info available to fetch cart items");
    }
  };

  const toggleItemSelection = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
    // เช็คว่าหลังจากเลือกสินค้าแล้ว ทุกชิ้นถูกเลือกหรือไม่
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    const allSelected = updatedItems.every((item) => item.selected);
    setSelectAll(allSelected);
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems(
      cartItems.map((item) => ({ ...item, selected: newSelectAll }))
    );
  };

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    setIsApplyButtonActive(true); // เปลี่ยนสีเมื่อคลิก
    setTimeout(() => setIsApplyButtonActive(false), 200); // คืนค่าเดิมหลังจาก 200ms

    // ตรวจสอบว่าคูปองที่เลือกคือ "เลือกคูปอง" หรือไม่
    if (selectedCoupon === "") {
      setDiscountAmount(0); // ยกเลิกการใช้งานคูปอง
    } else {
      // คำนวณจำนวนเงินที่ลดจากคูปอง
      const coupon = coupons.find((c) => c.code === selectedCoupon);
      if (coupon) {
        if (coupon.discount_type === "Percentage") {
          const discount = (subtotal * coupon.discount_value) / 100;
          setDiscountAmount(discount);
          console.log("disco", discount);
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

  const removeSelectedItems = async () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      alert("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้นเพื่อลบ");
      return;
    }

    const confirmation = window.confirm(
      "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าที่เลือก?"
    );
    if (!confirmation) return;

    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No authToken found");
        return;
      }

      // สร้างคำขอลบสินค้าทั้งหมดที่เลือก
      await Promise.all(
        selectedItems.map((item) =>
          axios.delete(
            `${conf.urlPrefix}/api/cart-items/${item.item_cart_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );

      // อัปเดต state เพื่อลบสินค้าที่ถูกลบออกจาก cartItems
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            !selectedItems.some(
              (selected) => selected.item_cart_id === item.item_cart_id
            )
        )
      );
      alert("ลบสินค้าที่เลือกเรียบร้อยแล้ว");
    } catch (error) {
      console.error(
        "Error removing selected items:",
        error.response?.data || error
      );
      alert("เกิดข้อผิดพลาดในการลบสินค้า กรุณาลองใหม่อีกครั้ง");
    }
  };

  useEffect(() => {
    if (userInfo) {
      const fetchCartItems = async () => {
        // console.log(userInfo)
        try {
          const token = Cookies.get("authToken");
          if (!token) {
            console.error("No authToken found");
            return;
          }
          const response = await axios.get(
            `${conf.urlPrefix}/api/carts?filters[user][id][$eq]=${userInfo.id}&populate=cart_items.item.img`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log("API Response:", response.data);

          
          if (response.data.data && Array.isArray(response.data.data)) {
            const items = response.data.data.flatMap((cart) =>
              cart.cart_items && Array.isArray(cart.cart_items)
                ? cart.cart_items.map((cartItem) => ({
                    ...cartItem.item,
                    quantity: cartItem.amount, 
                    selected: false,
                    item_cart_id: cartItem.id, 
                    size: cartItem.size,
                    color: cartItem.color,
                  }))
                : []
            );
            // console.log("Fetched items:", items); 
            setCartItems(items);
          } else {
            console.error("Invalid data structure:", response.data);
          }
        } catch (error) {
          console.error(
            "Error fetching cart items:",
            error.response?.data || error
          );
        }
      };

      fetchCartItems();
    } else {
      // console.log("No user info available to fetch cart items");
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      setUserAddress(userInfo.address);
      if (Array.isArray(userInfo.coupons)) {
        setCoupons(userInfo.coupons);
      } else {
        console.error("Coupons data is not an array:", userInfo.coupons);
        setCoupons([]);
      }
    }
  }, [userInfo]);

  return (
    <div className="min-h-screen max-w bg-white ">
      {/* Logo */}
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-6">
            <img
              src="/fs-logo.png"
              alt="Fashion Shop Logo"
              className="w-24 h-24"
            />
            <div
              className="text-5xl font-bold"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
            >
              <span style={{ color: "#C8A36E", opacity: "0.85" }}>FASHION</span>
              <span className="text-gray-800"> SHOP</span>
            </div>
          </div>
        </div>
      </div>
      <div className="disabled">
        {/* Cart Content */}
        <div className="container mx-auto pb-16" style={{ marginTop: "4rem" }}>
          <div className="container flex flex-col lg:flex-row gap-16 ">
            {/* Cart Items */}
            <div className="w-full mx-10">
              <Card className="bg-white shadow-sm w-full">
                <CardContent className="p-6 w-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="select-all"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                      />
                      <label htmlFor="select-all" className="text-lg">
                        Select all
                      </label>
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
            <div className="w-[40%] mx-10">
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
        </div>
      </div>
      {isCheckoutPopupOpen && (
        <CheckoutPopup
          items={cartItems.filter((item) => item.selected)}
          total={calculateTotal()}
          discountAmount={discountAmount}
          onClose={() => setIsCheckoutPopupOpen(false)} // ปิด popup หลังจาก checkout
          handleCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

export default Cart;
