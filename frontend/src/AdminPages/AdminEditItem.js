import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AdminEditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch categories
    axios.get("http://localhost:1337/api/categories").then((res) => {
      setCategories(res.data.data);
    });

    // Fetch item data
    axios.get(`http://localhost:1337/api/items/${id}?populate=categories,img`).then((res) => {
      const item = res.data.data;
      setName(item.attributes.name);
      setDescription(item.attributes.description);
      setPrice(item.attributes.price);
      setSelectedCategories(item.attributes.categories.data);
      setImages(item.attributes.img.data || []);
    });
  }, [id]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await axios.post("http://localhost:1337/api/upload", formData);
      return response.data[0].id;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
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
    const imageIds = await Promise.all(images.map(uploadImage));
    
    const postData = {
      data: {
        name,
        description,
        price: parseFloat(price),
        categories: selectedCategories.map((cat) => cat.id),
        img: imageIds.map((id) => ({ id }))
      },
    };

    axios.put(`http://localhost:1337/api/items/${id}`, postData).then(() => {
      alert("Item updated successfully");
      navigate("/admin/items");
    }).catch((error) => {
      console.error("Error updating item:", error);
      alert("Failed to update item");
    });
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
                {images.map((image, index) => (
                  <img key={index} src={image.url || URL.createObjectURL(image)} alt="Uploaded Preview" className="w-24 h-24 object-cover rounded-md border" />
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
