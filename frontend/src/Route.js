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

  const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<Products />} />
    <Route path="/adminpage" element={<AdminPage />} />
    <Route path="/addcoupon" element={<AddCoupons />} />
    <Route path="/order" element={<OrderList />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/login" element={<LoginScreen />} />
    <Route path="/product/:id" element={<ItemDetail />} />
  </Routes>
);

export default AppRoutes;
