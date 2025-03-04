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
        <div className="flex flex-col min-h-screen overflow-hidden">
          <Header />
          <main className="flex-grow">
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
