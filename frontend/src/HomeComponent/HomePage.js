import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { TextInput } from "flowbite-react";

// ข้อมูลสินค้า
const popularProducts = [
  { id: 1, title: "Text", price: "$49", image: "/img.jpg" },
  { id: 2, title: "Text", price: "$149", image: "/img.jpg" },
  { id: 3, title: "Text", price: "$299", image: "/img.jpg" },
];

export default function HomePage() {
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
          <TextInput type="search" placeholder="ค้นหา..." className="pl-10 bg-[#e9e3ed] rounded-full focus:ring-[#c4a484] focus:border-[#c4a484]" />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* Popular Products */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl italic">Popular products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {popularProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 shadow rounded">
              <img src={product.image} alt={product.title} className="w-full h-40 object-cover" />
              <p className="mt-2">{product.title}</p>
              <p>{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <div className="my-8 text-center relative">
        <img src="/baner.jpg" alt="Banner" className="w-full h-60 object-cover" />
        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 rounded">Shop Now</button>
      </div>

      {/* Collection */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl italic">COLLECTION</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white p-4 shadow rounded">
              <img src="/img.jpg" alt="Product" className="w-full h-40 object-cover" />
              <p>Text product</p>
              <p>99999 robux</p>
              <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">สั่งซื้อ</button>
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
