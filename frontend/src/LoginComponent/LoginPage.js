import React from "react";
import LoginForm from "./LoginFrom";
import image from "./image.png";


const LoginScreen = () => {
  return (
    <div className="flex min-h-screen justify-center bg-gray-100 p-8">
      {/* Login Form */}
      <LoginForm />

      {/* Image Section */}
      <div className="flex items-center justify-center ml-8">
        <img src={image} alt="Login Illustration" className="w-100 h-100 object-cover" />
      </div>
    </div>
  );
};

export default LoginScreen;
