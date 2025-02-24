import React, { useState } from "react";
import { Input, Button, Spin, Alert, Timeline, Card } from "antd";
import { SearchOutlined, ClockCircleOutlined } from "@ant-design/icons";

const OrderStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);


  const fetchOrderStatus = async () => {
    setLoading(true);
    setError("");
    setOrderStatus(null);

    setTimeout(() => {
      const mockData = {
        1001: ["Order Placed", "Processing", "Shipped", "Delivered"],
        1002: ["Order Placed", "Processing"],
      };

      if (mockData[orderId]) {
        setOrderStatus(mockData[orderId]);
      } else {
        setError("Order not found! Please check your Order ID.");
      }

      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
      <Card title="Check Order Status" bordered={false}>
        <Input
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={fetchOrderStatus}
          disabled={!orderId}
        >
          Check Status
        </Button>

        {loading && <Spin style={{ marginTop: 20 }} />}

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginTop: 20 }} />
        )}

        {orderStatus && (
          <Timeline style={{ marginTop: 20 }}>
            {orderStatus.map((status, index) => (
              <Timeline.Item key={index} dot={<ClockCircleOutlined />}>
                {status}
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    </div>
  );
};

export default OrderStatus;
