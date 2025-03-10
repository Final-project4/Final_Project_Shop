import React, { useState, useEffect } from "react";
import { Spin, Alert, Card, List, Row, Col } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import conf from "../conf/config";
import { useAuth } from "../context/AuthContext";
import { getAuthToken } from "../context/auth";

const OrderStatus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const { userInfo } = useAuth();
  const token = getAuthToken();
  console.log(userInfo)

  useEffect(() => {
    const fetchOrderItems = async (orders) => {
      try {
        const updatedOrders = await Promise.all(
          orders.map(async (order) => {
            const response = await fetch(
              `${conf.urlPrefix}/api/orders/${order.id}?populate=orderItems`,
              {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include'
              }
            );
            if (!response.ok) {
              throw new Error(
                `Failed to fetch order items for order ${order.id}`
              );
            }
            const data = await response.json();
            return { ...order, order_items: data.order_items };
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
        return (
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "red",
            }}
          />
        );
      case "paid":
        return <ClockCircleOutlined />;
      case "completed":
        return (
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "green",
            }}
          />
        );
      default:
        return <ClockCircleOutlined />;
    }
  };
  
  return (
    <div style={{ width: "100%", height: "100vh", margin: "50px auto" }}>
      <Card title="Your Orders Status" style={{ height: "100%" }}>
        {loading && <Spin style={{ marginTop: 20 }} />}

        {error && (
          <Alert    
            message={error}
            type="error"
            showIcon
            style={{ marginTop: 20 }}
          />
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
                extra={getStatusDot(order.step)}
                style={{ marginBottom: 20 }}
              >
                <div>
                  <strong>Update At:</strong>{" "}
                  {new Date(order.updatedAt).toLocaleString()}
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
                    dataSource={order.order_items || []}
                    renderItem={(item) => (
                      <List.Item>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <img
                            src={`${conf.urlPrefix}${item.item.img.url}`}
                            alt={item.item.name}
                            width={50}
                            height={50}
                            style={{ borderRadius: "10px" }}
                          />
                          <div>
                            <strong>{item.item.name}</strong> - {item.quantity}{" "}
                            pcs {item.price} THB
                          </div>
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
