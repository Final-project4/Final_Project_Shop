import Sidebar from "./Sidebar";
import { useState, } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([
    { id: "A001", date: "2025-02-09", name: "S. Nann", total: "360 Baht", status: "กำลังสั่ง", slip: "" },
    { id: "A002", date: "2025-02-10", name: "S. Nann", total: "400 Baht", status: "ยังไม่จ่าย", slip: "" },
    { id: "A003", date: "2025-02-09", name: "S. Nann", total: "500 Baht", status: "ยังไม่จ่าย", slip: "" },
  ]);

  const updateStatus = (index, newStatus) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = newStatus;
    setOrders(updatedOrders);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar /> 

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-5 text-center">Order List</h2>
        
        <div className="bg-white shadow-md rounded-lg p-5">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Order #</th>
                <th className="p-2">Date</th>
                <th className="p-2">Name</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Slip</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">#{order.id}</td>
                  <td className="p-2">{order.date}</td>
                  <td className="p-2">{order.name}</td>
                  <td className="p-2">{order.total}</td>
                  <td className="p-2 font-semibold">
                    {order.status === "จ่ายแล้ว" ? (
                      <span className="text-green-600">จ่ายแล้ว</span>
                    ) : order.status === "ถูกยกเลิก" ? (
                      <span className="text-red-600">ถูกยกเลิก</span>
                    ) : (
                      <span className="text-gray-600">{order.status}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {order.slip ? (
                      <img src={order.slip} alt="Slip" className="w-20 h-20 object-cover rounded-md" />
                    ) : (
                      <span className="text-gray-500">No Slip</span>
                    )}
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => updateStatus(index, "จ่ายแล้ว")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Confirmed
                    </button>
                    <button
                      onClick={() => updateStatus(index, "ถูกยกเลิก")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Canceled
                    </button>
                    <button
                      onClick={() => updateStatus(index, "กำลังสั่ง")}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Pending
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
