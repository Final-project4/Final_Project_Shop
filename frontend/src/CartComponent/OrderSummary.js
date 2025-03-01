import React from "react";
import { Card, CardContent } from "../components/ui/card";

const OrderSummary = ({
  userAddress,
  subtotal,
  shippingFee,
  discountAmount,
  calculateTotal,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  handleApplyVoucher,
  isApplyButtonActive,
  handleProceedToCheckout,
  isCheckoutButtonActive,
}) => {
  return (
      <Card className="bg-gray-50 top-4">
        <CardContent className="p-8">
          <div className="bg-gray-100 p-6 rounded-lg space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-lg">Location</span>
              <span className="text-lg">{userAddress || "ไม่มีที่อยู่"}</span>
            </div>
            <div>
              <h2 className="font-medium text-xl mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{subtotal.toFixed(2)} Baht</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span>{shippingFee.toFixed(2)} Baht</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Discount</span>
                  <span>-{discountAmount.toFixed(2)} Baht</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedCoupon}
                onChange={(e) => setSelectedCoupon(e.target.value)}
                className="flex-1 bg-white border border-gray-200 py-3 text-lg"
              >
                <option value="">เลือกคูปอง</option>
                {Array.isArray(coupons) &&
                  coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.code}>
                      {coupon.code}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={(e) => handleApplyVoucher(e)}
                style={{
                  backgroundColor: isApplyButtonActive ? "#8B4513" : "#DAA520",
                  opacity: "0.45",
                }}
                className="text-white px-8 py-3 rounded-lg font-medium text-lg shadow-lg transition-colors duration-200 cursor-pointer"
              >
                APPLY
              </button>
            </div>
            <div className="flex justify-between font-medium text-xl">
              <span>Total</span>
              <span>{calculateTotal().toFixed(2)} Baht</span>
            </div>
            <button
              type="button"
              onClick={(e) => handleProceedToCheckout(e)}
              style={{
                backgroundColor: isCheckoutButtonActive ? "#800000" : "#AF2C02",
              }}
              className="w-full text-white py-4 rounded-lg font-medium text-lg shadow-lg transition-colors duration-200 cursor-pointer"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </CardContent>
      </Card>
  );
};

export default OrderSummary;
