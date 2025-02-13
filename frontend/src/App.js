import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import AppRoutes from "./Route"; // ต้องตรงกับชื่อไฟล์

function App() {
  return (
    <Router>
      <Header />
      <AppRoutes /> {/* ✅ ไม่ต้องมี <Routes> ซ้อนอีก */}
    </Router>
  );
}

export default App;