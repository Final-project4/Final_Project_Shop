import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import generatePayload from "promptpay-qr";

const CheckoutPopup = ({
  items,
  total,
  discountAmount,
  onClose,
  handleCheckout,
}) => {
  const [showQR, setShowQR] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const promptPayID = "0922567600"; // หรือใช้เลขบัญชีธนาคาร เช่น "1234567890123"
  console.log("total",total)
  const generatePromptPayQR = (promptPayID, amount) => {
    if (!promptPayID) {
      return "";
    }
    if (!amount || isNaN(amount)) {
      return generatePayload(promptPayID); // กรณีไม่ต้องระบุจำนวนเงิน
    }
    return generatePayload(promptPayID, { amount: parseFloat(amount) });
  };

  const qrData = generatePromptPayQR(promptPayID, total); // ต้องมีค่าแน่นอน

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadAndCheckout = async () => {
    setUploading(true);

    // สร้าง JSON body ในรูปแบบที่กำหนด
    const orderItems = items.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      order: 2, // แทนที่ด้วย ID คำสั่งซื้อที่แท้จริงถ้ามี
      item: item.id, // สมมติว่า item.id ตรงกับ ID ของสินค้า
    }));

    const jsonBody = {
      data: orderItems.length === 1 ? orderItems[0] : orderItems, // ปรับสำหรับสินค้าชิ้นเดียว
    };

    console.log("JSON Body:", jsonBody); // ตรวจสอบ JSON body

    await handleCheckout(file, jsonBody); // ✅ ส่ง JSON body พร้อมกับไฟล์
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4">Confirm Your Order</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold mt-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold mt-2">
          <span>Discount</span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>

        {showQR ? (
          <div className="flex flex-col items-center mt-4">
            {qrData ? (
              <>
                <QRCodeCanvas value={qrData} size={200} />
                <p className="mt-2 text-sm text-gray-500">
                  สแกน QR เพื่อชำระเงินผ่าน PromptPay
                </p>
              </>
            ) : (
              <p className="text-red-500">Error: ไม่สามารถสร้าง QR ได้</p>
            )}
            <input type="file" onChange={handleFileChange} className="mt-4" />
            <button
              onClick={handleUploadAndCheckout}
              disabled={uploading}
              className={`mt-2 ${
                uploading ? "bg-gray-400" : "bg-blue-500"
              } text-white px-4 py-2 rounded`}
            >
              {uploading ? "กำลังอัปโหลด..." : "อัปโหลดและยืนยันคำสั่งซื้อ"}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowQR(true)}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPopup;
