import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomeComponent/HomePage";
import LoginScreen from "./LoginComponent/LoginPage";


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

export default App;