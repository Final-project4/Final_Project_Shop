import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import conf from "../conf/config";
import Swal from "sweetalert2";
import backgroundImage from "./background3.png";

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
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    const authToken = Cookies.get("authToken");
  
    if (!authToken) {
      navigate("/login");
      return;
    }
  
    const fetchUserData = async () => {
      try {
        // เปลี่ยนการ query API ใหม่
        const response = await fetch("http://localhost:1337/api/users/me", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        const userData = await response.json();
        
        // ดึงข้อมูลรูปภาพแยก
        const profileResponse = await fetch(`http://localhost:1337/api/users/${userData.id}?populate=*`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        const profileData = await profileResponse.json();
        console.log("Profile Data:", profileData); // ดูข้อมูลที่ได้
        console.log("Profile Picture Array:", profileData.profilePicture);
        if (profileData.profilePicture && profileData.profilePicture.length > 0) {
          console.log("First Profile Picture:", profileData.profilePicture[0]);
          const imageUrl = `http://localhost:1337${profileData.profilePicture[0].url}`;
          console.log("Constructed Image URL:", imageUrl);
          setProfilePicture(imageUrl);
        }
        
        setUser(profileData);
        setUsername(profileData.username);
        setEmail(profileData.email);
        setPhoneNumber(profileData.phoneNumber);
        setAddress(profileData.address);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Can not fetch user data',
          icon: 'error',
          confirmButtonColor: '#CC0000'
        });
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    // cleanup function สำหรับ object URL
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const authToken = Cookies.get("authToken");

    try {
      let uploadedImageId = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('files', imageFile);

        const uploadResponse = await fetch(`${conf.urlPrefix}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const uploadResult = await uploadResponse.json();
        uploadedImageId = uploadResult[0].id;
      }

      // อัพเดทข้อมูลผู้ใช้
      const updateData = {
        username,
        email,
        phoneNumber,
        address,
      };

      // เพิ่มการอัพเดทรูปโปรไฟล์
      if (uploadedImageId) {
        updateData.profilePicture = uploadedImageId;
      }

      const response = await fetch(`http://localhost:1337/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // รีโหลดข้อมูลผู้ใช้
      const updatedUserResponse = await fetch(`http://localhost:1337/api/users/${user.id}?populate=*`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      const updatedUserData = await updatedUserResponse.json();
      console.log("Updated User Data:", updatedUserData);
      console.log("Updated Profile Picture Array:", updatedUserData.profilePicture);
      if (updatedUserData.profilePicture && updatedUserData.profilePicture.length > 0) {
        console.log("First Updated Profile Picture:", updatedUserData.profilePicture[0]);
        const imageUrl = `http://localhost:1337${updatedUserData.profilePicture[0].url}`;
        console.log("Constructed Updated Image URL:", imageUrl);
        setProfilePicture(imageUrl);
      }

      setUser(updatedUserData);

      // แสดง success message
      Swal.fire({
        title: 'Success!',
        text: 'Update data successfully',
        icon: 'success',
        confirmButtonColor: '#0000CC'
      });

    } catch (error) {
      setError(error.message);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#CC0000'
      });
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // สร้าง object URL และเก็บไว้ใน state
      const newObjectUrl = URL.createObjectURL(file);
      setObjectUrl(newObjectUrl);
      setProfilePicture(newObjectUrl);
    }
  };

  const handleResetImage = () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
    setObjectUrl(null);
    setProfilePicture(null);
    setImageFile(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex justify-center items-center"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '792px'
      }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        style={{ 
          height: '792px',
          overflowY: 'auto'
        }}>
        <h1 className="text-2xl font-medium mb-4 text-center">Account Information</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            {profilePicture ? (
              <div className="relative">
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-200"
                  style={{ 
                    borderRadius: '50%',
                    aspectRatio: '1/1',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    console.log("Image load error:", e);
                    e.target.src = "path/to/fallback/image.png";
                  }}
                />
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                >
                  ×
                </button>
              </div>
            ) : (
              <div 
                className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-200"
                style={{ 
                  borderRadius: '50%',
                  aspectRatio: '1/1'
                }}
              >
                <span className="text-gray-500 text-lg">No Image</span>
              </div>            
            )}           
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              style={{ maxWidth: '87px', height: '40px', margin: '0 auto', borderRadius: '15px', opacity: 1, border: 'none'}}
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
          <div className="flex justify-center mt-8 pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-5"
                style={{ maxWidth: '170px', height: '37px', backgroundColor: '#0000CD', transition: 'background-color 0.4s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00008B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0000CD'}
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