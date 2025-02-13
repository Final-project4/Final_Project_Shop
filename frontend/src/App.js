import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomeComponent/HomePage";
<<<<<<< HEAD
import LoginScreen from "./LoginComponent/LoginPage";

=======
import AppRoutes from "./Route";
import AdminPage from "./AdminPages/AdminPageAddItem";
import AddCoupons from "./AdminPages/ADD_COUPONS"; 
import OrderList from "./AdminPages/Order_List";
>>>>>>> b918b4bcb04e68ba6a393311bfac0dfd19664d98

function App() {
  return (
    <Router>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </>
    </Router>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomeComponent/HomePage";
import ItemDetail from "./ItemDetail";
import Products from "./ProductList/Products";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ItemDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
>>>>>>> b918b4bcb04e68ba6a393311bfac0dfd19664d98
