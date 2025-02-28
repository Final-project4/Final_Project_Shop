import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import ReactSlider from "react-slider";

const Products = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState(null); // เปลี่ยนค่าเริ่มต้นเป็น null
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
      item.price >= priceRange[0] && item.price <= priceRange[1] && 
      (!searchQuery ||
        (item.name &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price;
    } else if (sortOrder === "desc") {
      return b.price - a.price;
    } else {
      return 0; // ไม่จัดเรียงถ้า sortOrder เป็น null
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

  const handleSortOrder = (order) => {
    setSortOrder((prevOrder) => (prevOrder === order ? null : order));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl p-6 rounded-lg sticky top-0 h-screen space-y-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">หมวดหมู่</h2>
          <ul className="space-y-4">
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
        </div>

        <div className="my-12"> {/* ใช้ my-12 แทน mt-12 mb-12 */}
          <h2 className="text-xl font-semibold mb-6">กำหนดราคา</h2>
          <ReactSlider
            className="w-full mt-2"
            value={priceRange}
            onChange={(newValue) => setPriceRange(newValue)}
            min={0}
            max={10000}
            step={100}
            renderTrack={(props, state) => {
              const { key, ...restProps } = props;
              return (
                <div
                  {...restProps}
                  key={key}
                  className={`flex-1 h-2 rounded-full bg-blue-200`}
                />
              );
            }}
            renderThumb={(props, state) => {
              const { key, ...restProps } = props;
              return (
                <div
                  {...restProps}
                  key={key}
                  className="w-6 h-6 bg-blue-500 rounded-full cursor-pointer"
                />
              );
            }}
            pearling
            minDistance={100}
          />
          <div className="flex justify-between mt-10">
            <p>ต่ำสุด: {priceRange[0]} บาท</p>
            <p>สูงสุด: {priceRange[1]} บาท</p>
          </div>
        </div>

        <div className="my-12"> {/* ใช้ my-12 แทน mt-12 mb-12 */}
          <h2 className="text-xl font-semibold mb-6">จัดเรียงตาม</h2>
          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={() => handleSortOrder("asc")}
              className={`px-4 py-2 rounded-lg ${
                sortOrder === "asc"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              ราคาต่ำสุด
            </button>
            <button
              onClick={() => handleSortOrder("desc")}
              className={`px-4 py-2 rounded-lg ${
                sortOrder === "desc"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              ราคาสูงสุด
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="w-full mb-6 flex justify-center">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="w-2/3 md:w-1/2 lg:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border-blue-500"
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
                <div className="flex flex-wrap gap-2 mt-4 mb-4 justify-center">
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
                  <div className="h-18">
                    <h2 className="text-gray-900 font-medium text-sm">
                      {item.name}
                    </h2>
                  </div>
                  
                  <div className="flex flex-row justify-center items-center mt-2">
                    <p className="text-[#C9A36B] font-bold text-lg">
                      ราคา       {item.price} บาท
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
  );
};

export default Products;