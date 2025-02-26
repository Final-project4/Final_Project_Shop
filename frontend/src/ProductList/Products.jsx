import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const Products = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("asc");
  const colors = ["bg-blue-500", "bg-green-500", "bg-red-500", "bg-yellow-500"];

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/categories")
      .then((response) => {
        setCategories(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Error fetching categories");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/items?populate=*")
      .then((response) => {
        setProducts(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Error fetching products");
        setLoading(false);
      });
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      return newCategories;
    });
  };

  const filterByCategory = (categories) => {
    if (categories.length > 0) {
      return products.filter((item) => {
        return (
          item.categories &&
          item.categories.some((cat) => categories.includes(cat.name))
        );
      });
    }
    return products;
  };

  const filteredProducts = filterByCategory(selectedCategories).filter(
    (item) =>
      item.price <= maxPrice &&
      (!searchQuery ||
        (item.name &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-2xl mt-10">{error}</div>
    );
  }
  console.log(currentItems);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white shadow-xl p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">หมวดหมู่</h2>
          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                className={`cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                  selectedCategories.includes(category.name)
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => toggleCategory(category.name)}
              >
                {category.name}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-6">กำหนดราคา</h2>
          <input
            type="range"
            min="100"
            max="10000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full mt-2"
          />
          <p className="text-center mt-2">ราคาสูงสุด: {maxPrice} บาท</p>

          <h2 className="text-xl font-semibold mt-6">จัดเรียงตาม</h2>
          <div className="flex items-center space-x-4 mt-2">
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="asc">ราคาต่ำสุด</option>
              <option value="desc">ราคาสูงสุด</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-3">
          <div className="w-full mb-6 flex justify-center">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              className="w-2/3 md:w-1/2 lg:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Link to={`/product/${item.id}`}>
                  <div className="p-4 text-center">
                    <img
                      src={`http://localhost:1337${
                        item.img?.formats?.small?.url ||
                        item.img?.url ||
                        "/placeholder.jpg"
                      }`}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="h-18">
                      <h2 className="text-gray-900 font-medium text-sm">
                        {item.name}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.categories.map((category, index) => (
                        <div
                          key={index}
                          className={`px-4 py-2 text-white rounded-full shadow-md text-sm font-medium ${
                            colors[index % colors.length]
                          }`}
                        >
                          {category.name} 
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-row">
                      <p className="text-[#C9A36B] font-bold text-base mt-2">
                        {item.price} บาท
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <nav>
              <ul className="flex list-none">
                {Array.from(
                  { length: Math.ceil(sortedProducts.length / itemsPerPage) },
                  (_, i) => (
                    <li key={i} className="mx-1">
                      <button
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === i + 1
                            ? "bg-blue-500 text-white"
                            : "bg-white text-blue-500"
                        }`}
                      >
                        {i + 1}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
