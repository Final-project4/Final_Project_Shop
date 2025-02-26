import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./styles.css";


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
            setImages([]); // ถ้าไม่มีรูป ใช้ default หรือปล่อยเป็น array ว่าง
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
    <div className="admin-container">
      <Sidebar />
      <div className="content">
        <h1 className="title">Edit Item</h1>
        <div className="form-container">
          <div className="section">
            <h2>General Information</h2>
            <label>Name Product:</label>
            <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Description Product:</label>
            <textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>

          <div className="section">
            <h2>Upload Image</h2>
            <input type="file" multiple className="file-input" onChange={handleImageUpload} />
            <div className="image-preview">
              {images.map((image, index) => (
                <img key={index} src={typeof image === "string" ? image : URL.createObjectURL(image)} alt={`Uploaded Preview ${index}`} className="preview-img" />
              ))}
            </div>
          </div>

          <div className="section">
            <h2>Pricing</h2>
            <label>Price:</label>
            <input type="number" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className="section">
            <h2>Category</h2>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="dropdown-button">Select Category ▼</button>
            {isDropdownOpen && (
              <ul className="dropdown">
                {categories.map((category) => (
                  <li key={category.id} onClick={() => setSelectedCategories([...selectedCategories, category])}>{category.name}</li>
                ))}
              </ul>
            )}
            <div className="selected-categories">
              {selectedCategories.map((category) => (
                <span key={category.id} className="selected-category">
                  {category.name} <button onClick={() => setSelectedCategories(selectedCategories.filter((c) => c.id !== category.id))}>✖</button>
                </span>
              ))}
            </div>
          </div>

          <button className="add-button" onClick={handleSaveItem}>Save Item</button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditItem;
