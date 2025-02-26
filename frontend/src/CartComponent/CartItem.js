import React from "react";
import { Trash2 } from "lucide-react";
import Checkbox from "../components/ui/checkbox";

const CartItem = ({
  item,
  updateQuantity,
  removeItem,
  toggleItemSelection,
}) => {
  return (
    <div className="bg-gray-100 p-10 rounded-lg mb-4">
      <div className="flex items-center py-6 w-full gap-6">
        <Checkbox
          checked={item.selected}
          onChange={() => toggleItemSelection(item.id)}
        />
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={`http://localhost:1337${
              item.img?.formats?.small?.url ||
              item.img?.url ||
              "/placeholder.jpg"
            }`}
            alt={item.name || "Product Image"}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg truncate">
            {item.name || "Unknown Product"}
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            ${(item.price * item.quantity || 0).toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded">
            <button
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-lg"
              onClick={() => updateQuantity(item.id, -1)}
            >
              -
            </button>
            <span className="w-12 text-center text-lg">{item.quantity}</span>
            <button
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-lg"
              onClick={() => updateQuantity(item.id, 1)}
            >
              +
            </button>
          </div>
          <Trash2
            size={20}
            className="text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={() => removeItem(item.item_cart_id)}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
