import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomeComponent/HomePage.js";
import Products from "./ProductList/Products.jsx";
import AdminPage from "./AdminPages/AdminPageAddItem.js";
import AddCoupons from "./AdminPages/ADD_COUPONS.js";
import OrderList from "./AdminPages/Order_List.js";
import CartPage from "./CartComponent/Cart.js";
import LoginScreen from "./LoginComponent/LoginPage.js";
import ItemDetail from "./ItemDetail/ItemDetail.js";
import SignUpPage from "./LoginComponent/SignUpPage.js";
import AccountPage from "./LoginComponent/AccountPage.js";
import OrderStatus from "./StatusPage/Status.js";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<Products />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/login" element={<LoginScreen />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/account" element={<AccountPage />} />
    <Route path="/status" element={<OrderStatus />} />
    <Route path="/product/:id" element={<ItemDetail />} />
    <Route
      path="/adminpage"
      element={
        <ProtectedRoute adminOnly>
          <AdminPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/addcoupon"
      element={
        <ProtectedRoute adminOnly>
          <AddCoupons />
        </ProtectedRoute>
      }
    />
    <Route
      path="/order"
      element={
        <ProtectedRoute adminOnly>
          <OrderList />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
