import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomeComponent/HomePage";
import AppRoutes from "./Route";
import AdminPage from "./AdminPages/AdminPageAddItem";
import AddCoupons from "./AdminPages/ADD_COUPONS"; 
import OrderList from "./AdminPages/Order_List";

function App() {
  return (
    <Router>
      <>
        <Header />
        <AppRoutes/>
      </>
    </Router>
  );
}

export default App;
