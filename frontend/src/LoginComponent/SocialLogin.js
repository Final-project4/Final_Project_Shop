import React from "react";
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const SocialLogin = () => {
  return (
    <div className="flex justify-center mt-8 pt-8">
      <a href="www.google.com" target="_blank" className="text-gray-500 mx-4">
        <FaGoogle size={32} color="#DB4437" />
      </a>
      <a href="www.facebook.com" target="_blank" className="text-gray-500 mx-4">
        <FaFacebook size={32} color="#4267B2" />
      </a>
    </div>
  );
};

export default SocialLogin;
