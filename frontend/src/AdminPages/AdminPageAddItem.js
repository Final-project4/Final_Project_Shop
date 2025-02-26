import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import "./styles.css";

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
    <div className="admin-container">
      <Sidebar />
      <div className="content">
        <h1 className="title">Add Item</h1>
        <div className="form-container">
          <div className="section">
            <h2>General Information</h2>
            <label>Name Product:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <label>Description Product:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="section">
            <h2>Upload Img</h2>
            <input type="file" multiple onChange={handleImageUpload} className="file-input" />
            <div className="image-preview">
              {images.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} alt="Preview" className="large-image" />
              ))}
            </div>
          </div>

          <div className="section">
            <h2>Pricing</h2>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <span>Baht</span>
          </div>

          <div className="section">
            <h2>Category</h2>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>Select Category ▼</button>
            {isDropdownOpen && (
              <ul className="dropdown">
                {categories.map((category) => (
                  <li key={category.id} onClick={() => toggleCategory(category)}>
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
            <div className="selected-categories">
              {selectedCategories.map((category) => (
                <span key={category.id} className="selected-category">
                  {category.name} <button onClick={() => toggleCategory(category)}>✖</button>
                </span>
              ))}
            </div>
          </div>

          <button className="add-button" onClick={handleAddItem}>Add Item</button>
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
