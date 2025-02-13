import React, { useState, useEffect } from "react";
import image from "./image.png";
import backgroundImage from "./background.png";
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const LoginScreen = () => {
  const [color, setColor] = useState('#FFFFFF');

  useEffect(() => {
    setColor('#FFEBB0');
  }, []);

  return (
    <div className="flex min-h-screen justify-center bg-gray-100 p-8">
      {/* Login Form */}
      <div
        className="flex flex-col w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <h1 className="text-2xl font-light tracking-wider text-center mb-6 mt-8 pt-8">LOGIN</h1>

        <form action="#" method="POST" className="space-y-6 mt-8 pt-4">
          <div className="mt-8">
            <label htmlFor="email" className="block text-sm font-light text-gray-900 text-center">
              Email address
            </label>
            <div className="mt-8">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                style={{ backgroundColor: color, color: 'white', border: 'none', textAlign: 'center' }}
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="password" className="block text-sm font-light text-gray-900 text-center">
              Password
            </label>
            <div className="mt-6">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                style={{ backgroundColor: color, color: 'white', border: 'none', textAlign: 'center' }}
              />
            </div>
          </div>

          <div className="mt-8 pt-3">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            >
              Sign in
            </button>
          </div>

          <div className="flex justify-center mt-8 pt-8">
            <a href="www.google.com" target="_blank" className="text-gray-500 mx-4">
              <FaGoogle size={32} color="#DB4437" />
            </a>
            <a href="www.facebook.com" target="_blank" className="text-gray-500 mx-4">
              <FaFacebook size={32} color="#4267B2" />
            </a>
          </div>

          <div className="mt-8 pt-8 text-center">
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign up
          </a>
        </p>
      </div>

      {/* Image Section */}
      <div className="flex items-center justify-center ml-8">
        <img src={image} alt="Login Illustration" className="w-100 h-100 object-cover" />
      </div>
    </div>
  );
};

export default LoginScreen;