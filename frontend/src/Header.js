import React from "react";
import { Navbar, Button } from "flowbite-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar fluid className="bg-blue-700 text-white py-4 px-6">
      <Navbar.Brand as={Link} to="/">
        <span className="self-center text-xl font-semibold whitespace-nowrap">
          MyShop
        </span>
      </Navbar.Brand>
      <div className="flex items-center gap-6">
        <Navbar.Collapse>
          <Navbar.Link as={Link} to="/" className="text-white hover:text-gray-200">
            หน้าแรก  
          </Navbar.Link>
          <Navbar.Link as={Link} to="/products" className="text-white hover:text-gray-200">
            รายการสินค้า
          </Navbar.Link>
          <Navbar.Link as={Link} to="/adminpage" className="text-white hover:text-gray-200">
            ติดต่อ
          </Navbar.Link>
        </Navbar.Collapse>
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <svg className="w-6 h-6 text-white hover:text-gray-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l3.6 7.59m10.24 0L21 5H7m2 14a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </Link>
          <Link to="/account">
            <svg className="w-6 h-6 text-white hover:text-gray-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.88 6.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
          <Button gradientDuoTone="purpleToBlue">Login</Button>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
