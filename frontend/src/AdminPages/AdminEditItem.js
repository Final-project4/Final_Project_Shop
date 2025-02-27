import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AdminEditItem = () => {
  const { documentId } = useParams(); // ใช้ documentId แทน id
  console.log("useParams documentId:", documentId);
  const [item, setItem] = useState({});
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/items/${documentId}?populate=img`);
        console.log("API Response:", response.data);
        console.log("Fetched item categories:", item.categories)
  
        if (response.data && response.data.data) {
          const item = response.data.data;

          setName(item.name || "");
          setDescription(item.description || "");
          setPrice(item.price || "");
          setSelectedCategories(item.categories || []); // ถ้า categories เป็น array ให้ใช้เลย
          if (item.img && item.img.length > 0) {
            setImages(item.img.map(img => `http://localhost:1337${img.url}`));
          } else {
            setImages([]);
          }
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };
  
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/categories?populate=*");
        console.log("Fetched categories:", response.data);
  
        if (response.data && response.data.data) {
          setCategories(response.data.data.map(cat => ({
            id: cat.id - 1,
            name: cat.name || "Unknown"
          })));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchItem();
    fetchCategories();
  }, [documentId]);
  

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("files", file);
  
    try {
      const response = await axios.post("http://localhost:1337/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data && response.data.length > 0) {
        return response.data[0].id; // คืนค่า ID ของรูปภาพที่อัปโหลดสำเร็จ
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    return null;
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages([...images, ...files]);
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.some((item) => item.id === category.id)
        ? prev.filter((item) => item.id !== category.id)
        : [...prev, category]
    );
  };

  const handleSaveItem = async () => {
    try {
      console.log("🔹 ก่อนอัปโหลดรูปภาพ Images:", images);
  
      // 🔥 อัปโหลดเฉพาะรูปใหม่เท่านั้น
      const imageIds = await Promise.all(images.map(async (img) => {
        if (typeof img === "string") {
          return null; // ถ้าเป็น URL เดิมให้ข้ามไป
        }
        return await uploadImage(img);
      }));
  
      const filteredImageIds = imageIds.filter(id => id !== null); // ตัด null ออก
  
      // ✅ ถ้าไม่มีการเปลี่ยนรูปภาพ ไม่ต้องส่ง `img` ไป
      const postData = {
        data: {
          name,
          description,
          price: parseFloat(price),
          categories: selectedCategories.map(cat => cat.id),
          ...(filteredImageIds.length > 0 && { img: filteredImageIds.map(id => ({ id })) })
        }
      };
  
      console.log("🚀 Sending Data:", postData);
  
      const response = await axios.put(`http://localhost:1337/api/items/${documentId}`, postData);
      console.log("✅ Item updated successfully", response.data);
      alert("Item updated successfully");
      navigate("/admin/items");
    } catch (error) {
      console.error("❌ Error updating item:", error);
      if (error.response) {
        console.warn("⚠️ Response Data:", error.response.data);
      }
      alert("Failed to update item");
    }
  };
  
  

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-10 flex flex-col items-center overflow-auto">
        <h1 className="text-3xl font-bold mb-5">
          <span className="text-[#daa520]">FASHION</span> SHOP
        </h1>

        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex flex-col space-y-4">
            <div className="relative bg-gray-200 rounded-lg p-4 flex flex-col items-center">
              <input type="file" multiple onChange={handleImageUpload} className="hidden" id="imageUpload" />
              <label htmlFor="imageUpload" className="text-gray-500 cursor-pointer border border-gray-400 rounded-md px-4 py-2 mt-2">
                Upload Picture
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                {images.map((image, index) => {
                  // ตรวจสอบว่า image เป็น object ที่มาจาก backend หรือเป็นไฟล์ที่อัปโหลด
                  const imageUrl = typeof image === "string"
                    ? image // ถ้าเป็น URL จาก backend ให้ใช้เลย
                    : URL.createObjectURL(image); // ถ้าเป็นไฟล์จาก input ให้สร้าง URL

                  return (
                    <img
                      key={index}
                      src={imageUrl}
                      alt="Uploaded Preview"
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                  );
                })}
              </div>
            </div>

            <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} className="p-3 w-full border border-gray-300 rounded-md bg-[#f7ead1] text-gray-700" />
            <textarea placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-3 w-full h-24 border border-gray-300 rounded-md bg-[#f7ead1] text-gray-700"></textarea>

            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="px-4 py-2 bg-gray-300 rounded-md text-lg w-full text-left">
                Select Category ▼
              </button>
              {isDropdownOpen && (
                <ul className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {categories.map((category) => (
                    <li key={category.id} onClick={() => toggleCategory(category)} className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${selectedCategories.some(item => item.id === category.id) ? 'bg-gray-300' : ''}`}>
                      {category.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <div key={category.id} className="flex items-center bg-gray-300 px-3 py-1 rounded-md">
                  {category.name}
                  <button onClick={() => toggleCategory(category)} className="ml-2 text-red-600 font-bold">×</button>
                </div>
              ))}
            </div>

            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="p-3 w-full border border-gray-300 rounded-md bg-[#f7ead1] text-gray-700" />

            <button onClick={handleSaveItem} className="px-6 py-3 bg-[#d4af37] text-black font-bold rounded-lg shadow-md hover:bg-[#b9972b] transition">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditItem;
