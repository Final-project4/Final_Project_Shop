import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImage from "./signup.png";
import backgroundImage from "./background1.png";
import Swal from 'sweetalert2';
import conf from "../conf/config";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${conf.urlPrefix}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Sign up failed");
      }

      console.log("Signed up successfully:", data);
      
      // แสดง Popup แจ้งเตือนการสมัครสำเร็จ
      await Swal.fire({
        title: 'Sign up successful!',
        html: `
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <i class="fas fa-user-plus text-4xl text-blue-500"></i>
            </div>
            <p class="text-lg">Welcome ${username} to our website</p>
            <p class="text-sm text-gray-600 mt-2">Please login to use</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#0000CD',
        customClass: {
          popup: 'welcome-popup',
          content: 'welcome-content'
        }
      });

      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center bg-gray-100">
      {/* ส่วนของรูปภาพด้านซ้าย */}
      <div className="hidden md:flex items-center">
        <img src={signupImage} alt="Sign Up Illustration" className="object-cover" style={{ width: '950px', height: '792px' }} />
      </div>

      {/* ส่วนของฟอร์มด้านขวา */}
      <div className="flex flex-col bg-white p-8 rounded-lg shadow-lg"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '700px',
          height: '792px'
        }}>
        <h1 className="text-2xl font-light tracking-wider text-center mb-2 mt-8 pt-8">SIGN UP</h1>
        
        <div className="h-8 flex items-center justify-center">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 text-center">Username</label>
            <div className="mt-2 flex justify-center">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block px-3 py-1.5 text-sm"
                style={{ border: 'none', width: '250px', height: '35px', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1

                 }}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-center">Email</label>
            <div className="mt-2 flex justify-center">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block px-3 py-1.5 text-sm"
                style={{ border: 'none' , width: '250px', height: '35px', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 }}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-center">Password</label>
            <div className="mt-2 flex justify-center">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block px-3 py-1.5 text-sm"
                style={{ border: 'none',  width: '250px', height: '35px', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 }}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-center">Confirm Password</label>
            <div className="mt-2 flex justify-center">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block px-3 py-1.5 text-sm"
                style={{ border: 'none', width: '250px', height: '35px', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 }}
                required
              />
            </div>
          </div>

          <div className="mt-8 pt-8 flex justify-center">
            <button
              type="submit"
              className="flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
              style={{ 
                width: '170px', 
                height: '35px', 
                borderRadius: '15px', 
                backgroundColor: '#0000CD',
                opacity: 0.9,
                transition: 'background-color 0.3s ease'
              }}
   
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00008B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0000CD'}
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-8 pt-4 flex justify-center">
          <button
            onClick={handleBackToLogin}
            className="flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white"
            style={{ 
              width: '170px', 
              height: '35px', 
              borderRadius: '15px', 
              backgroundColor: '#CC0000',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#990000'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#CC0000'}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;