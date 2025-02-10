import React from "react";

const Header = () => {
    return (
        <div>
            <nav className="flex space-x-4">
                <a href="#" className="hover:text-gray-300">หน้าหลัก</a>
                <a href="#" className="hover:text-gray-300">รายการทั้งหมด</a>
                <a href="#" className="hover:text-gray-300">หมวดหมู่</a>
            </nav>
            <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-300">เกี่ยวกับเรา</a>
                <a href="#" className="hover:text-gray-300">ติดต่อเรา</a>
            </div>
        </div>
    );
};

export default Header;
