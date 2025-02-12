import { Routes, Route } from "react-router-dom";
import HomePage from "./HomeComponent/HomePage.js";
import Products from "./ProductList/Products.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<Products/>}/>
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
