import React from "react";
import { Navbar, Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useAuth } from './context/AuthContext';

const Header = () => {
  const { isLoggedIn, logout,isAdmin,userInfo} = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: 'Confirm Logout',
      text: "Are you sure you want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0000CC',
      cancelButtonColor: '#CC0000',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

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
              to="/adminpage"
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
              <Button
                style={{
                  backgroundColor: "#020d29",
                  color: "white",
                  padding: "1px 1px",
                  border: "1px solid #555",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "300",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#444")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#020d29")}
                onClick={handleLogout}
              >
                Logout
              </Button>
          ) : (
            <Link to="/login">
              <Button
                style={{
                  backgroundColor: "#020d29",
                  color: "white",
                  padding: "1px 1px",
                  border: "1px solid #555",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "300",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#444")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#020d29")}
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
