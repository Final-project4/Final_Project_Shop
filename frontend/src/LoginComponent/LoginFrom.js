import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import SocialLogin from "./SocialLogin";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import backgroundImage from "./background1.png";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState("#FFEFD5");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

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
      console.log("Login Response:", data);
      if (!response.ok) throw new Error(data.error?.message || "Login failed");
      const jwt = data.jwt;
      if (!jwt) throw new Error("JWT token not found");

      console.log("Logged in successfully:", data);
      Cookies.set("authToken", data.jwt, { expires: 7, secure: true });
      login();

      // ดึงข้อมูล user สำหรับ popup ต้อนรับ
      const userDetailResponse = await fetch(
        "http://localhost:1337/api/users/me?populate=*",
        {
          headers: {
            Authorization: `Bearer ${data.jwt}`,
          },
        }
      );

      const userDetailData = await userDetailResponse.json();

      // แสดง Popup ต้อนรับ
      await Swal.fire({
        title: `Welcome ${userDetailData.username}!`,
        html:
          userDetailData.profilePicture && userDetailData.profilePicture[0]
            ? `
            <div class="flex flex-col items-center">
              <img 
                src="http://localhost:1337${userDetailData.profilePicture[0].url}" 
                alt="Profile" 
                class="w-24 h-24 rounded-full object-cover mb-4"
              />
              <p class="text-lg">Login successfully!</p>
            </div>
          `
            : `
            <div class="flex flex-col items-center">
              <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <span class="text-gray-500">No Image</span>
              </div>
              <p class="text-lg">เข้าสู่ระบบสำเร็จ!</p>
            </div>
          `,
        icon: "success",
        confirmButtonColor: "#0000CC",
        customClass: {
          popup: "welcome-popup",
          content: "welcome-content",
        },
      });

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid identifier or password");
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div
      className="flex flex-col w-full bg-white p-8 rounded-lg shadow-lg"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "700px",
        height: "792px",
      }}
    >
      <h1 className="text-2xl font-light tracking-wider text-center mb-2 mt-8 pt-8">
        LOGIN
      </h1>

      <div className="h-8 flex items-center justify-center">
        {error && (
          <p className="text-red-500 text-sm text-center animate-fade-in">
            {error}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 mt-8">
        <InputField
          label="Email address"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{ backgroundColor: color }}
        />

        <InputField
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{ backgroundColor: color }}
        />

        <div className=" mt-6 pt-3">
          <button
            type="submit"
            className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-gray-500 shadow-sm hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            style={{
              maxWidth: "170px",
              height: "35px",
              margin: "0 auto",
              borderRadius: "15px",
              backgroundColor: "#FFE4B5",
              opacity: 0.9,
              transition: "background-color 0.4s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#FFDEAD")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#FFE4B5")
            }
          >
            Sign in
          </button>
        </div>
        <div className="mt-8 pt-2"></div>

        <SocialLogin />

        <div className="mt-7 pt-8 text-center">
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </a>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <button
          onClick={handleSignUp}
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
