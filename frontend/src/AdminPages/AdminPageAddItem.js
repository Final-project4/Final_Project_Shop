import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";

const AdminPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:1337/api/categories?populate=*")
      .then((res) => res.json())
      .then((data) => {
        console.log("Data from API:", data);
        if (data && data.data) {
          const formattedCategories = data.data.map(cat => ({
            id: cat.id - 1,
            name: cat.name || "Unknown"
          }));
          setCategories(formattedCategories);
        } else {
          console.error("Invalid API response:", data);
          setCategories([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setCategories([]);
      });
  }, []);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await axios.post("http://localhost:1337/api/upload", formData);
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

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleAddItem = async () => {
    try {
      if (!name || !description || selectedCategories.length === 0 || !price) {
        alert("กรอกข้อมูลให่ครบ");
        return;
    }

    const imageIds = await Promise.all(images.map(uploadImage));
    //ตรวจสอบว่าอัปสำเร็จหรือไม่
    if (imageIds.includes(null)) {
      alert("บางรูปอัปโหลดไม่สำเร็จ")
      return;
    }

    const postData = {
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categories: selectedCategories.map(cat => cat.id),
        img: imageIds.map(id => ({ id }))
      },
    };
    
    console.log("Sending data:", JSON.stringify(postData, null, 2));

    const response = await axios.post(
      "http://localhost:1337/api/items",
      postData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response.data);

    if (response.status === 200 || response.status === 201) {
      alert("Item added succesful");
    } else {
      alert("Failed")
    }
  } catch (error) {
    console.error("Error adding item:", error);
    if (error.response) {
      console.log("Response Data:", error.response.data);
      alert(`❌ ไม่สามารถเพิ่มสินค้าได้: ${error.response.data.error.message}`);
    } else {
      alert("❌ ไม่สามารถเพิ่มสินค้าได้ กรุณาตรวจสอบ backend");
    }
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
                Add Picture
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <img key={index} src={URL.createObjectURL(image)} alt="Uploaded Preview" className="w-24 h-24 object-cover rounded-md border" />
                ))}
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

            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="p-3 w-full border border-gray-300 rounded-md bg-[#f7ead1] text-gray-700"
              />
              <span className="text-lg font-semibold">Baht</span>
            </div>

            <button onClick={handleAddItem} className="px-6 py-3 bg-[#d4af37] text-black font-bold rounded-lg shadow-md hover:bg-[#b9972b] transition">
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
