import React from "react";
import LoginForm from "./LoginFrom";
import image from "./image.png";

const LoginScreen = () => {
  return (
    <div className="flex h-full w-full  items-center bg-gray-100">
      <div className="hidden md:flex items-center">
        <img src={image} alt="Login Illustration" className="object-cover" style={{ width: '950px', height: '792px' }} />
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginScreen;