import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
<<<<<<< HEAD
import AppRoutes from "./Route"; // ต้องตรงกับชื่อไฟล์
=======
import HomePage from "./HomeComponent/HomePage";
import LoginScreen from "./LoginComponent/LoginPage";

>>>>>>> ffb67da (LoginPage)

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <Header />
      <AppRoutes /> {/* ✅ ไม่ต้องมี <Routes> ซ้อนอีก */}
=======
      <>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </>
>>>>>>> ffb67da (LoginPage)
    </Router>
  );
}

export default App;