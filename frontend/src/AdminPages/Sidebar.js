import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-900 text-white p-5">
      <h1 className="text-xl font-bold mb-5">ADMIN PAGE</h1>
      <nav>
        <Link to="/admin/add-item" className="block py-2 text-lg hover:text-[#daa520] transition-colors">
          ADD ITEM
        </Link>
        <Link to="/admin/add-coupons" className="block py-2 text-lg hover:text-[#daa520] transition-colors">
          ADD COUPONS
        </Link>
        <Link to="/admin/order-list" className="block py-2 text-lg hover:text-[#daa520] transition-colors">
          Order list
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
