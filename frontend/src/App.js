import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import AppRoutes from "./Route";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./ItemDetail/CartContext";
import Footer from "./FooterComponent/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="overflow-hidden"
          <Header />
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
