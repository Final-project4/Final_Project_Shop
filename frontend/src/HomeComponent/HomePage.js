import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { TextInput } from "flowbite-react";
import axios from "axios";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/items?populate=*")
      .then((response) => {
        console.log("API Response:", response.data);
        setProducts(response.data.data || []); 
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);
  console.log("data:::::", products);
  return (
    <div className="min-h-screen bg-[#faf7f7]">
      {/* Header */}
      <div className="container mx-auto py-8 text-center">
        <Link to="/" className="inline-block">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-[#c4a484] flex items-center justify-center">
              <span className="text-2xl font-serif text-[#c4a484]">FS</span>
            </div>
          </div>
        </Link>
        <h1 className="mt-4 text-3xl font-serif">
          <span className="text-[#c4a484]">FASHION</span> SHOP
        </h1>
      </div>

      {/* Search */}
      <div className="container mx-auto px-4 mb-12">
        <div className="relative max-w-md mx-auto">
          <TextInput
            type="search"
            placeholder="ค้นหา..."
            className="pl-10 bg-[#e9e3ed] rounded-full focus:ring-[#c4a484] focus:border-[#c4a484]"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* Popular Products */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl italic">Popular products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 shadow rounded">
              <img
                src={product.img.url}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <p className="mt-2">{product.name}</p>
              <p>{product.price} บาท</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <div className="my-8 text-center relative">
        <img
          src="/baner.jpg"
          alt="Banner"
          className="w-full h-60 object-cover"
        />
        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 rounded">
          Shop Now
        </button>
      </div>

      {/* Collection */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl italic">COLLECTION</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {(products || []).map((product) => (
            <div key={product.id} className="bg-white p-4 shadow rounded">
              <img
                src={
                  product.attributes?.image?.data?.attributes?.url ||
                  "/placeholder.jpg"
                }
                alt={product.attributes?.title || "No Title"}
                className="w-full h-40 object-cover"
              />
              <p>{product.attributes?.title || "No Title"}</p>
              <p>{product.attributes?.price || "N/A"} บาท</p>
              <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                สั่งซื้อ
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e2a4a] text-white py-4 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 FashionShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
