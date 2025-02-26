import React from "react";
import { Navbar, Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Header = () => {
  const { userInfo, logout,isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  console.log("userad",isAdmin)
  return (
    <Navbar
      fluid
      className={`bg-gradient-to-r ${
        isAdmin ? "from-blue-700 to-cyan-400" : "from-green-700 to-yellow-400"
      } text-white py-4 px-6`}
    >
      <Navbar.Brand as={Link} to="/">
        <span className="self-center text-xl font-semibold whitespace-nowrap">
          {isAdmin ? "Admin Dashboard" : "MyShop"}
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

          {isAdmin && (
            <Navbar.Link
              as={Link}
              to="/admin"
              className="text-white hover:text-gray-200"
            >
              Dashboard Admin
            </Navbar.Link>
          )}
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

          {userInfo ? (
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
