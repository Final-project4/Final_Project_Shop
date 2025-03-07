import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { TextInput } from "flowbite-react";
import axios from "axios";
import PopularProducts from "./poppular";
import conf from "../conf/config";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${conf.urlPrefix}/api/items?populate=*`)
      .then((response) => {
        setProducts(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="h-full w-screen bg-[#faf7f7]">
      {/* Header */}
      <div className="container mx-auto py-8 flex items-center justify-center space-x-4 text-center">
        <Link to="/">
          <img
            src="/fs-logo.png"
            alt="Fashion Shop Logo"
            className="max-h-12 w-20 rounded-full object-contain shadow-md"
          />
        </Link>

        <h1 className="mt-4 text-3xl font-serif">
          <span className="text-[#c4a484]">FASHION</span> SHOP
        </h1>
      </div>

      <PopularProducts products={products} />

      {/* Banner */}
      <div className="my-8 text-center relative">
        <img
          src="/baner.jpg"
          alt="Banner"
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
        <Link
          to="/productlist"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#dea82a] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#dea82a] transition"
        >
          🛒 Shop Now
        </Link>
      </div>

      {/* Collection */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl italic mt-8">🎨 Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {products.map((product) => (
            <Link to={`/product/${product.id}`}>
              <div
                key={product.id}
                className="bg-white p-4 shadow rounded-lg hover:shadow-lg transition transform hover:scale-105"
              >
                <img
                  src={`${conf.urlPrefix}${
                    product.img?.url || "/placeholder.jpg"
                  }`}
                  alt={product.name || "No Title"}
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="mt-2 font-medium text-lg">
                  {product.name || "No Title"}
                </p>
                <p className="text-gray-600">{product.price ?? "N/A"} บาท</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e2a4a] text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 FashionShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
