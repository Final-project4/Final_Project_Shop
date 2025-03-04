import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import conf from "../conf/config";
import { getAuthToken } from "../context/auth";

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
  const jwt = localStorage.getItem("jwt");
  const [sizes, setSizes] = useState({});
  const [newSize, setNewSize] = useState("");
  const token = getAuthToken();

  

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${conf.urlPrefix}/api/items?filters[id][$eq]=${documentId}&populate=*`, {
          headers: { Authorization: `Bearer ${token}`},
        });
        console.log("API Response:", response.data);
        console.log("Fetched item categories:", item.categories)
  
        if (response.data && response.data.data) {
          const item = response.data.data[0];
          console.log("Fetched item data:", item);

          setName(item.name || "");
          setDescription(item.description || "");
          setPrice(item.price || "");
          setSelectedCategories(item.categories || []); // ถ้า categories เป็น array ให้ใช้เลย
          console.log(item)
          if (item.img) {
            if (Array.isArray(item.img.data)) {
              // กรณี img เป็น Array
              setImages(item.img.data.map(img => `${conf.urlPrefix}${img.attributes.url}`));
            } else {
              // กรณี img เป็น Object เดียว
              setImages([`${conf.urlPrefix}${item.img.url}`]);
            }
          } else {
            setImages([]);
          }
          setSizes(item.size || {size: "", stock: ""})
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };
  
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${conf.urlPrefix}/api/categories?populate=*`,{
          headers: { Authorization: `Bearer ${token}`}
        });
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
  }, [documentId, jwt]);

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
  

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("files", file);
  
    try {
      const response = await axios.post(`${conf.urlPrefix}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" , Authorization: `Bearer ${token}`},
      });
  
      if (response.data && response.data.length > 0) {
        return response.data[0].id; // คืนค่า ID ของรูปภาพที่อัปโหลดสำเร็จs
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

  const handleRemoveSize = (size) => {
    setSizes((prev) => {
      const updatedSizes = { ...prev };
      delete updatedSizes[size]; // ลบ key ออกจาก Object
      return updatedSizes;
    });
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
          categories: selectedCategories.map(cat => cat.id-1),
          size: sizes,
          ...(filteredImageIds.length > 0 && { img: filteredImageIds.map(id => ({ id })) })
        }
      };
  
      console.log("🚀 Sending Data:", postData);
  
      const response = await axios.put(`${conf.urlPrefix}/api/items?filters[id][$eq]=${documentId}`, postData, {
        headers: { Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
      });
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
    <div className="flex h-full bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-10 flex flex-col items-center overflow-auto h-full">
        <h1 className="text-4xl font-bold mb-6 text-[#daa520]">EDIT ITEM</h1>
        <div className="bg-white rounded-xl shadow-lg w-full h-full mr-4 ml-4 max-w-5xl grid grid-cols-2 gap-6">
          <div className="bg-gray-100 p-5 rounded-lg">
            <h2 className="text-lg font-semibold">General Information</h2>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 mt-3 border rounded-md bg-gray-200" />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-28 p-3 mt-3 border rounded-md bg-gray-200"></textarea>
          </div>
          <div className="bg-gray-100 p-5 rounded-lg">
            <h2 className="text-lg font-semibold">Upload Image</h2>
            <input type="file" multiple onChange={handleImageUpload} className="mt-3" />
            <div className="mt-4 grid grid-cols-3 gap-3">
              {images.map((image, index) => {
                // ตรวจสอบว่า image เป็น URL หรือไฟล์ใหม่
                const imageUrl =
                  typeof image === "string" ? image : 
                  image instanceof File ? URL.createObjectURL(image) :
                  image?.attributes?.url ? `${conf.urlPrefix}${image.attributes.url}` :
                  null;

                return imageUrl ? (
                  <img key={index} src={imageUrl} alt="Uploaded Preview" className="w-32 h-32 object-cover rounded-md border shadow-sm" />
                ) : (
                  <div key={index} className="w-32 h-32 flex items-center justify-center bg-gray-300 rounded-md border">
                    <span className="text-sm text-gray-500">Invalid Image</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-gray-100 p-5 rounded-lg">
            <h2 className="text-lg font-semibold">Pricing</h2>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full p-3 mt-3 border rounded-md bg-gray-200" />
          </div>
          <div className="bg-gray-100 p-5 rounded-lg relative">
            <h2 className="text-lg font-semibold">Category</h2>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full p-3 mt-3 bg-gray-300 text-white rounded-md">Select Category ▼</button>
            {isDropdownOpen && (
              <ul className="absolute left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-10">
                {categories.map((category) => (
                  <li key={category.id} onClick={() => toggleCategory(category)} className="p-2 cursor-pointer hover:bg-gray-300">
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span key={category.id} className="bg-gray-400 text-white px-3 py-1 rounded-md flex items-center">
                  {category.name}
                  <button onClick={() => toggleCategory(category)} className="ml-2 text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>
          
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
            <div className="mt-3"></div>
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
          <button 
            onClick={handleSaveItem}
            className="col-span-2 bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-md hover:bg-yellow-600 transition">
            UPDATE ITEM
          </button>
          </div>

          
        </div>
      </div>
  );
}

export default AdminEditItem;
