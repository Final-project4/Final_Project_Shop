import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomeComponent/HomePage";
import CartPage from "./CartComponent/Cart";

function App() {
  return (
    <Router>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<CartPage />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
