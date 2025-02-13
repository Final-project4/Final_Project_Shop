import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
<<<<<<< HEAD
import HomePage from "./HomeComponent/HomePage";
import CartPage from "./CartComponent/Cart";
import AppRoutes from "./Route";
=======
import AppRoutes from "./Route"; // ต้องตรงกับชื่อไฟล์

>>>>>>> dev
function App() {
  return (
    <Router>
      <Header />
      <AppRoutes /> {/* ✅ ไม่ต้องมี <Routes> ซ้อนอีก */}
    </Router>
  );
}

export default App;
