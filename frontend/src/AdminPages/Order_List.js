import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import conf from "../conf/config";

const AdminOrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${conf.urlPrefix}/api/orders?populate=*`);
      const data = await response.json();
      setOrders(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStep) => {
    try {
      const orderToUpdate = orders.find((order) => order.id === orderId);
      if (!orderToUpdate) return;

      const updatedData = {
        step: newStep,
        slip: orderToUpdate.slip,
      };

      await fetch(`${conf.urlPrefix}/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: updatedData }),
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, step: newStep } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Order Dashboard</h1>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border border-gray-300">วันที่สั่งซื้อ</th>
                <th className="p-3 border border-gray-300">สถานะ</th>
                <th className="p-3 border border-gray-300">ราคารวม</th>
                <th className="p-3 border border-gray-300">สลิปการจ่ายเงิน</th>
                <th className="p-3 border border-gray-300">อัปเดตสถานะ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-300 h-14">
                  <td className="p-3">{formatDate(order.createdAt)}</td>
                  <td className="p-3">{order.step || "ไม่มีสถานะ"}</td>
                  <td className="p-3">{order.total_price ? `${order.total_price} บาท` : "ไม่มีราคา"}</td>
                  <td className="p-3">
                    {order.slip && order.slip.length > 0 ? (
                      <a href={`http://localhost:1337${order.slip[0].url}`} target="_blank" rel="noopener noreferrer">
                        <img
                          src={`http://localhost:1337${order.slip[0].formats.thumbnail.url}`}
                          alt="สลิปการจ่ายเงิน"
                          className="w-24 rounded-lg mx-auto cursor-pointer"
                        />
                      </a>
                    ) : (
                      <span className="text-gray-500">ไม่มีสลิป</span>
                    )}
                  </td>
                  <td className="p-3">
                    <select
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      defaultValue={order.step || "pending"}
                      className="p-2 border border-gray-300 rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDashboard;
