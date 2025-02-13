import { Routes, Route } from "react-router-dom";
import HomePage from "./HomeComponent/HomePage.js";
import Products from "./ProductList/Products.jsx";
import AdminPage from "./AdminPages/AdminPageAddItem.js";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<Products/>}/>
      <Route path="adminpage" element={<AdminPage />} />
    </Routes>
  );
};

export default AppRoutes;
