import React from "react";

const Header = () => {
    return (
        <header className="bg-gray-800 text-white fixed top-0 left-0 w-full shadow-md z-50">
            <nav className="container mx-auto flex justify-between items-center py-4 px-6">
                
                <ul className="flex space-x-6">
                    <li><a href="#" className="hover:text-gray-300">หน้าหลัก</a></li>
                    <li><a href="#" className="hover:text-gray-300">รายการทั้งหมด</a></li>
                    <li><a href="#" className="hover:text-gray-300">หมวดหมู่</a></li>
                </ul>

                
                <ul className="flex space-x-6">
                    <li><a href="#" className="hover:text-gray-300">เกี่ยวกับเรา</a></li>
                    <li><a href="#" className="hover:text-gray-300">ติดต่อเรา</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
