import React from 'react';

export default function HomePage() {
  return (  
    <div className="min-h-screen bg-gray-100">
      {/* Logo & Search Bar */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold">FASHION SHOP</h1>
        <input type="text" placeholder="ค้นหา..." className="mt-4 p-2 border rounded w-1/2" />
      </div>

      {/* Popular Products */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl italic">Popular products</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-4 shadow rounded">
              <img src="/placeholder.svg" alt="Product" className="w-full h-40 object-cover" />
              <p className="mt-2">Text product</p>
              <p>$299</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <div className="my-8 text-center relative">
        <img src="/placeholder.svg" alt="Banner" className="w-full h-60 object-cover" />
        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 rounded">Shop Now</button>
      </div>

      {/* Collection */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl italic">COLLECTION</h2>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white p-4 shadow rounded">
              <img src="/placeholder.svg" alt="Product" className="w-full h-40 object-cover" />
              <p>Text product</p>
              <p>99999 robux</p>
              <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">สั่งซื้อ</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
