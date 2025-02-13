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
