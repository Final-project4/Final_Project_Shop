import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // เพิ่ม state สำหรับ password
  const [phoneNumber, setPhoneNumber] = useState(""); // เพิ่ม state สำหรับ phone number
  const [address, setAddress] = useState(""); // เพิ่ม state สำหรับ address
  const [profilePicture, setProfilePicture] = useState(null);
  const [imageFile, setImageFile] = useState(null); // เพิ่ม state สำหรับ image file
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = Cookies.get("authToken");
  
    if (!authToken) {
      navigate("/login");
      return;
    }
  
    fetch("http://localhost:1337/api/users/me?populate=*", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
        setAddress(data.address);
        // แก้ไข URL ของรูปภาพให้สมบูรณ์
        setProfilePicture(data.Image ? `http://localhost:1337${data.Image.url}` : null);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const authToken = Cookies.get("authToken");

    try {
      // อัปโหลดรูปภาพก่อนถ้ามีการเปลี่ยนแปลง
      let uploadedImageUrl = profilePicture;
      if (imageFile) {
        const formData = new FormData();
        formData.append("files", imageFile);

        const uploadResponse = await fetch("http://localhost:1337/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok) {
          uploadedImageUrl = uploadData[0].url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const response = await fetch(`http://localhost:1337/api/users/${user.id}`, { // ใช้ user.id เพื่ออัปเดตข้อมูลผู้ใช้
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password, // เพิ่ม password ในคำขอ
          phoneNumber: phoneNumber, // เพิ่ม phoneNumber ในคำขอ
          address: address, // เพิ่ม address ในคำขอ
          profilePicture: uploadedImageUrl, // ใช้ URL ของรูปภาพที่อัปโหลด
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Update failed");
      }

      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setProfilePicture(URL.createObjectURL(file)); // แสดงภาพที่เลือกก่อนอัปโหลด
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">

        <h1 className="text-2xl font-medium mb-4 text-center">Account Information</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
         <div className="flex justify-center">
          {profilePicture ? (
           <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
           ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>            
           )}           
         </div>
        <div>
        </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              style={{ maxWidth: '86px', height: '35px', margin: '0 auto', borderRadius: '15px', opacity: 1 , border: 'none'}}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              style={{ maxWidth: '400px', height: '31px', margin: '0 auto', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 , border: 'none'}}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              style={{ maxWidth: '400px', height: '31px', margin: '0 auto', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 , border: 'none'}}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              style={{ maxWidth: '400px', height: '31px', margin: '0 auto', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 , border: 'none'}}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              style={{ maxWidth: '400px', height: '31px', margin: '0 auto', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 , border: 'none'}}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              style={{ maxWidth: '400px', height: '30px', margin: '0 auto', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 , border: 'none'}}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-5"
                style={{ maxWidth: '170px', height: '37px', backgroundColor: '#0000FF', transition: 'background-color 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00008B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0000FF'}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;