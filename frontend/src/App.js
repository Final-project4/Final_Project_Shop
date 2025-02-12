import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomeComponent/HomePage";
import AppRoutes from "./Route";
function App() {
  return (
    <Router>
      <>
        <Header />
        <AppRoutes/>
      </>
    </Router>
  );
}

export default App;
