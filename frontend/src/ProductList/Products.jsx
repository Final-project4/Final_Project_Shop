import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import ReactSlider from "react-slider";
import conf from "../conf/config";

const Products = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    axios 
      .get(`${conf.urlPrefix}/api/categories`)
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
      .get(`${conf.urlPrefix}/api/items?populate=*`)
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
      item.price >= priceRange[0] &&
      item.price <= priceRange[1] &&
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
      <div className="w-64 bg-white shadow-xl p-6 rounded-lg sticky top-0 h-full space-y-12">
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
          <h2 className="text-xl font-semibold mt-6">กำหนดราคา</h2>
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
                  key={key}
                  {...restProps}
                  className={`flex-1 h-3 rounded-md bg-blue-200 ${
                    state.index === 1 ? "bg-blue-500" : ""
                  }`}
                />
              );
            }}
            renderThumb={(props) => {
              const { key, ...restProps } = props;
              return (
                <div
                  key={key}
                  {...restProps}
                  className="w-3 h-3 bg-gray-500 rounded-full cursor-pointer"
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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="w-full mb-6 flex justify-center">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="w-full md:w-1/2 lg:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    src={`${conf.urlPrefix}${
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
                        className={`px-2 py-1 text-xs font-medium rounded-md shadow-md border bg-gray-200 border-gray-500 text-gray-100`}
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
  );
};

export default Products;