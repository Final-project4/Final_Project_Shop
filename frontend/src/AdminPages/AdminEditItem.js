import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const AdminEditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:1337/api/items/${id}?populate=*`)
      .then((res) => {
        const item = res.data.data;
        setName(item.attributes.name);
        setDescription(item.attributes.description);
        setPrice(item.attributes.price);
        setSelectedCategories(item.attributes.categories.data);
      })
      .catch((err) => {
        console.error("Error fetching item:", err);
      });
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:1337/api/items/${id}`, {
        data: {
          name,
          description,
          price: parseFloat(price),
          categories: selectedCategories.map(cat => cat.id),
        }
      });
      console.log("Updated successfully:", response.data);
      alert("Item updated successfully");
      navigate("/admin/items");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-5 text-center">Edit Item</h1>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="p-3 border border-gray-300 rounded-md w-full mb-3" placeholder="Item Name" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="p-3 border border-gray-300 rounded-md w-full mb-3" placeholder="Description" />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="p-3 border border-gray-300 rounded-md w-full mb-3" placeholder="Price" />
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Update</button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditItem;
