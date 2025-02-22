import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import AppRoutes from "./Route"; // ต้องตรงกับชื่อไฟล์
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
    <Router>
      <Header />
      <AppRoutes /> {/* ✅ ไม่ต้องมี <Routes> ซ้อนอีก */}
    </Router>
    </AuthProvider>
  );
}

export default App;