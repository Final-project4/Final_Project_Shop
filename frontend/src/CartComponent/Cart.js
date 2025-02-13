import { useState } from "react"
import { Trash2, Search, ShoppingCart, User } from "lucide-react"
import Button from "../components/ui/button"
import Input from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import Checkbox from "../components/ui/checkbox"

function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Bracer of Strength",
      image: "/bracer.png",
      quantity: 1,
      price: 29.99,
      selected: false,
    },
    {
      id: 2,
      name: "Sunglasses",
      image: "/glasses.png",
      quantity: 1,
      price: 19.99,
      selected: false,
    },
    {
      id: 3,
      name: "Mel necklace",
      image: "/necklace.png",
      quantity: 1,
      price: 24.99,
      selected: false,
    },
  ])
  const [isApplyButtonActive, setIsApplyButtonActive] = useState(false);
  const [isCheckoutButtonActive, setIsCheckoutButtonActive] = useState(false);

  const [selectAll, setSelectAll] = useState(false)

  const subtotal = cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal > 50 ? 0 : 4.99
  const total = subtotal + shippingFee

  const updateQuantity = (id, change) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      ),
    )
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

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
                    onClick={() => setCartItems(cartItems.filter(item => !item.selected))}
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
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-lg truncate">{item.name}</h3>
                              <div className="text-sm text-gray-500 mt-2">• • •</div>
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
                                onClick={() => removeItem(item.id)}
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
                    PROCEED TO CHECKOUT ({cartItems.length})
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

export default CartPage