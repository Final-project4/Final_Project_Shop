import React, { useEffect, useState } from "react";
import { Navbar, Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ฟังก์ชันตรวจสอบคุกกี้
  const checkLoginStatus = () => {
    const cookies = document.cookie.split("; ");
    const authCookie = cookies.find((row) => row.startsWith("authToken="));
    setIsLoggedIn(!!authCookie);
  };

  useEffect(() => {
    checkLoginStatus(); // ตรวจสอบตอนโหลด Component

    // ตั้งค่าให้ตรวจสอบคุกกี้ทุก 1 วินาที
    const interval = setInterval(checkLoginStatus, 1000);

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  const handleLogout = () => {
    logout();
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <Navbar
      fluid
      className="bg-gradient-to-r from-blue-700 to-cyan-400 text-white py-4 px-6"
    >
      <Navbar.Brand as={Link} to="/">
        <span className="self-center text-xl font-semibold whitespace-nowrap">
          MyShop
        </span>
      </Navbar.Brand>
      <div className="flex items-center gap-6">
        <Navbar.Collapse>
          <Navbar.Link
            as={Link}
            to="/"
            className="text-white hover:text-gray-200"
          >
            หน้าแรก
          </Navbar.Link>
          <Navbar.Link
            as={Link}
            to="/products"
            className="text-white hover:text-gray-200"
          >
            รายการสินค้า
          </Navbar.Link>
          <Navbar.Link
            as={Link}
            to="/status"
            className="text-white hover:text-gray-200"
          >
            สถานะคำสั่งซื้อ
          </Navbar.Link>
        </Navbar.Collapse>
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <svg
              className="w-6 h-6 text-white hover:text-gray-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l3.6 7.59m10.24 0L21 5H7m2 14a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
          </Link>
          <Link to="/account">
            <svg
              className="w-6 h-6 text-white hover:text-gray-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A9 9 0 1118.88 6.197M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>

          {isLoggedIn ? (
            <Link to="/login">
              <Button gradientDuoTone="purpleToBlue" onClick={handleLogout}>
                Logout
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button gradientDuoTone="purpleToBlue">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
