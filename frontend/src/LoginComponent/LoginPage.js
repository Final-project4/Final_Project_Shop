import React from "react";
import LoginForm from "./LoginFrom";
import image from "./image.png";

const LoginScreen = () => {
  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">

      <LoginForm />


      <div className="hidden md:flex items-center justify-center ml-8">
        <img src={image} alt="Login Illustration" className="object-cover" style={{ width: '985px', height: '670px' }} />
      </div>
    </div>
  );
};

export default LoginScreen;