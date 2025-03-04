import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import conf from "../conf/config";
import { getAuthToken } from "../context/auth";

const AdminPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = getAuthToken();
  const [sizes, setSizes] = useState({});
  const [newSize, setNewSize] = useState("");

  useEffect(() => {
    fetch(`${conf.urlPrefix}/api/categories?populate=*`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data from API:", data);
        console.log("Request Headers:", axios.defaults.headers);
        if (data && data.data) {
          const formattedCategories = data.data.map((cat) => ({
            id: cat.id,
            name: cat.name || "Unknown",
          }));
          setCategories(formattedCategories);
        } else {
          console.error("Invalid API response:", data);
          setCategories([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setCategories([]);
      });
  }, []);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      console.log("from", formData);
      const response = await axios.post(
        `${conf.urlPrefix}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Uploaded Image Response:", response.data);

      if (response.data && response.data.length > 0) {
        return response.data[0].id;
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    return null;
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.some((item) => item.id === category.id)
        ? prev.filter((item) => item.id !== category.id)
        : [...prev, category]
    );
  };

  const handleAddSize = () => {
    if (!newSize.trim()) return; // ป้องกันการเพิ่มค่าว่าง
    if (sizes[newSize]) {
      alert("ไซส์นี้มีอยู่แล้ว!");
      return;
    }
    setSizes((prev) => ({ ...prev, [newSize]: 0 }));
    setNewSize(""); // ล้างค่า input
  };

  const handleSizeChange = (size, value) => {
    setSizes((prev) => ({
      ...prev,
      [size]: parseInt(value) || 0, // แปลงเป็นตัวเลข ถ้าเป็นค่าว่างให้เป็น 0
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveSize = (size) => {
    setSizes((prev) => {
      const updatedSizes = { ...prev };
      delete updatedSizes[size]; // ลบ key ออกจาก Object
      return updatedSizes;
    });
  };

  const handleAddItem = async () => {
    console.log("jwt:", token);
    try {
      if (!name || !description || selectedCategories.length === 0 || !price) {
        alert("กรอกข้อมูลให่ครบ");
        return;
      }

      const imageIds = await Promise.all(images.map(uploadImage));
      //ตรวจสอบว่าอัปสำเร็จหรือไม่
      if (imageIds.includes(null)) {
        alert("บางรูปอัปโหลดไม่สำเร็จ");
        return;
      }

      const postData = {
        data: {
          name: name,
          description: description,
          price: parseFloat(price),
          categories: selectedCategories.map((cat) => cat.id-1),
          size: sizes, // เพิ่มข้อมูล size
          img: imageIds.map((id) => ({ id })),
        },
      };

      console.log("Sending data:", JSON.stringify(postData, null, 2));

      const response = await axios.post(
        `${conf.urlPrefix}/api/items`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        alert("Item added successfully");
      } else {
        alert("Failed");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      if (error.response) {
        console.log("Response Data:", error.response.data);
        alert(
          `❌ ไม่สามารถเพิ่มสินค้าได้: ${error.response.data.error.message}`
        );
      } else {
        alert("❌ ไม่สามารถเพิ่มสินค้าได้ กรุณาตรวจสอบ backend");
      }
    }
  };

  return (
    <div className="flex h-full bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-10 flex flex-col items-center overflow-auto h-full">
        <h1 className="text-4xl font-bold mb-6 text-[#daa520]">FASHION SHOP</h1>
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl grid grid-cols-2 gap-6">
          <div className="bg-gray-100 p-5 rounded-lg">
            <h2 className="text-lg font-semibold">General Information</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-3 border rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#daa520]"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-28 p-3 mt-3 border rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#daa520]"
            ></textarea>
          </div>
          <div className="bg-gray-100 p-5 rounded-lg">
            <h2 className="text-lg font-semibold">Upload Image</h2>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="mt-3"
            />
            <div className="mt-4 grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt="Uploaded Preview"
                  className="w-32 h-32 object-cover rounded-md border shadow-sm"
                />
              ))}
            </div>
          </div>
          <div className="bg-gray-100 p-5 rounded-lg">
            <h2 className="text-lg font-semibold">Pricing</h2>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full p-3 mt-3 border rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#daa520]"
            />
          </div>
          <div className="bg-gray-100 p-5 rounded-lg relative">
            <h2 className="text-lg font-semibold">Category</h2>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3 mt-3 bg-gray-300 text-white rounded-md focus:outline-none"
            >
              Select Category ▼
            </button>
            {isDropdownOpen && (
              <ul className="absolute left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-10">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    onClick={() =>
                      setSelectedCategories([...selectedCategories, category])
                    }
                    className="p-2 cursor-pointer hover:bg-gray-300"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span
                  key={category.id}
                  className="bg-gray-400 text-white px-3 py-1 rounded-md flex items-center"
                >
                  {category.name}
                  <button
                    onClick={() =>
                      setSelectedCategories(
                        selectedCategories.filter((c) => c.id !== category.id)
                      )
                    }
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="bg-gray-100 p-5 rounded-lg">
            <h2 className="text-lg font-semibold">Sizes & Stock</h2>

            {/* Input เพิ่มไซส์ใหม่ */}
            <div className="flex mt-3 gap-2">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="เพิ่มไซส์ใหม่..."
                className="p-2 border rounded-md w-full"
              />
              <button
                onClick={handleAddSize}
                className="bg-green-500 text-white px-3 py-2 rounded-md"
              >
                ➕ เพิ่มไซส์
              </button>
            </div>

            {/* แสดงไซส์ที่เพิ่ม */}
            {Object.keys(sizes).length > 0 ? (
              Object.keys(sizes).map((size) => (
                <div
                  key={size}
                  className="flex justify-between items-center mt-2"
                >
                  <span className="font-medium">{size}</span>
                  <input
                    type="number"
                    value={sizes[size]}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                    className="w-20 p-2 border rounded-md bg-gray-200 text-center"
                  />
                  <button
                    onClick={() => handleRemoveSize(size)}
                    className="ml-2 text-red-500"
                  >
                    ❌
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mt-3">ยังไม่มีไซส์</p>
            )}
          </div>

          <button
            onClick={handleAddItem}
            className="col-span-2 bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-md hover:bg-yellow-600 transition"
          >
            ADD ITEM
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
