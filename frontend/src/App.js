import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import AppRoutes from "./Route";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./ItemDetail/CartContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
