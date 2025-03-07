import React, { useState, useEffect } from "react";
import { Spin, Alert, Card, List, Row, Col } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import conf from "../conf/config";
import { useAuth } from "../context/AuthContext";

const OrderStatus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchOrderItems = async (orders) => {
      try {
        const updatedOrders = await Promise.all(
          orders.map(async (order) => {
            const response = await fetch(`${conf.urlPrefix}/api/orders/${order.id}?populate=orderItems`);
            if (!response.ok) {
              throw new Error(`Failed to fetch order items for order ${order.id}`);
            }
            const data = await response.json();
            return { ...order, orderItems: data.orderItems || [] };
          })
        );
        setOrders(updatedOrders);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo || !userInfo.orders) {
      setLoading(false);
      return;
    }

    fetchOrderItems(userInfo.orders);
  }, [userInfo]);

  // Helper function to determine the appropriate dot based on order status
  const getStatusDot = (status) => {
    switch (status) {
      case "pending":
        return <ClockCircleOutlined style={{ color: 'gray' }} />;  // นาฬิกาสำหรับ pending
      case "paid":
        return <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'orange' }} />;  // วงกลมสีเหลืองสำหรับ paid
      case "completed":
        return <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'green' }} />;  // วงกลมสีเขียวสำหรับ completed
      default:
        return <ClockCircleOutlined style={{ color: 'gray' }} />;  // ค่าเริ่มต้นเป็นนาฬิกาสำหรับสถานะอื่น
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "50px auto" }}>
      <Card title="Your Orders Status" bordered={false}>
        {loading && <Spin style={{ marginTop: 20 }} />}

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginTop: 20 }} />
        )}

        {orders.length === 0 && !loading && !error && (
          <Alert
            message="No orders found."
            type="info"
            showIcon
            style={{ marginTop: 20 }}
          />
        )}

        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          {orders.map((order) => (
            <Col span={8} key={order.id}>
              <Card
                title={`Order ID: ${order.id}`}
                bordered={true}
                extra={getStatusDot(order.step)}
                style={{ marginBottom: 20 }}
              >
                <div>
                  <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Status:</strong> {order.step || "Pending"}
                </div>
                <div>
                  <strong>Total Price:</strong> {order.total_price} THB
                </div>
                <div style={{ marginTop: 10, textAlign: "left" }}>
                  <strong>Order Items:</strong>
                  <List
                    bordered
                    dataSource={order.orderItems || []}
                    renderItem={(item) => (
                      <List.Item>
                        <div>
                          <strong>{item.productName}</strong> - {item.quantity} pcs @ {item.price} THB
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default OrderStatus;
