import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomeComponent/HomePage";
import AdminPage from "./AdminPages/AdminPageAddItem";
import AddCoupons from "./AdminPages/ADD_COUPONS"; 
import OrderList from "./AdminPages/Order_List";

function App() {
  return (
    <Router>
      <>
        <Header />
        <Routes>
        <Route path="/" element={<AdminPage/>} />
        <Route path="/admin/add-item" element={<AdminPage/>} />
        <Route path="/admin/add-coupons" element={<AddCoupons />} />
        <Route path="/admin/order-list" element={<OrderList />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
