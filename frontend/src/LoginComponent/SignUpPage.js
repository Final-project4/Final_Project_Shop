import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImage from "./signup.png";

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
      const response = await fetch("http://localhost:1337/api/auth/local/register", {
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
      alert("Sign up successful!");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100 p-8">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden" style={{ width: '900px' }}>
        <div className="w-1/2 bg-cover" >
          <img src={signupImage} alt="Sign Up Illustration" className="object-cover" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="w-1/2 p-8">
          <h1 className="text-2xl font-light tracking-wider text-center mb-6">Sign Up</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mt-8">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ maxWidth: '400px', height: '35px', margin: '0 auto', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 , border: 'none'}}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ maxWidth: '400px', height: '35px', margin: '0 auto', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 , border: 'none'}}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ maxWidth: '400px', height: '35px', margin: '0 auto', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 , border: 'none'}}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ maxWidth: '400px', height: '35px', margin: '0 auto', borderRadius: '15px', backgroundColor: '#E0F7FA', opacity: 1 , border: 'none'}}
                required
              />
            </div>
            <div className="pt-0 flex justify-center">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-8"
                style={{ maxWidth: '400px', height: '37px', backgroundColor: '#0000FF', transition: 'background-color 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00008B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0000FF'}
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="mt-8 flex justify-center">
             <button
                onClick={handleBackToLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-8"
                style={{ maxWidth: '250px', height: '37px', backgroundColor: '#CC0000' , transition: 'background-color 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#990000'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#CC0000'}
             >
               Back to Login
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;