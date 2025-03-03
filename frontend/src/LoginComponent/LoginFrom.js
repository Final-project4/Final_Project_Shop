import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import SocialLogin from "./SocialLogin";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext"; // นำเข้า useAuth
import { Link } from "react-router-dom";
import conf from "../conf/config";

const LoginForm = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [color, setColor] = useState("#ffffff");
const [error, setError] = useState("");
const navigate = useNavigate();
const {login} =useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch(`${conf.urlPrefix}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });
      
      const data = await response.json();
      console.log("Login Response:", data)
      if (!response.ok) throw new Error(data.error?.message || "Login failed");
      const jwt = data.jwt;
      if (!jwt) throw new Error("JWT token not found");

      localStorage.setItem("jwt", jwt)

      const userResponse = await fetch(`${conf.urlPrefix}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const userData = await userResponse.json();
      console.log("User Data:", userData); // ✅ ดูว่ามี role มั้ย

      const userRole = userData?.role?.name || "No role found";
      console.log("User Role:", userRole);

      await login(data.jwt, data.user);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div
      className="flex flex-col w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      style={{ backgroundColor: color }}
    >
      <h1 className="text-2xl font-light tracking-wider text-center mb-6">
        LOGIN
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email address"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <InputField
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
          >
            Sign in
          </button>
        </div>

        <SocialLogin />

        <div className="mt-4 text-center">
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </a>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/signup">
          href="#"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
